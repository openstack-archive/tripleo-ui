/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import axios from 'axios';
import when from 'when';

import {
  AuthenticationError,
  MistralExecutionError,
  MistralApiError,
  ConnectionError
} from './errors';
import { getServiceUrl, getAuthTokenId } from './utils';
import MistralConstants from '../constants/MistralConstants';

class MistralApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'mistral').then(serviceUrl => {
      const requestAttributes = Object.assign(
        {
          baseURL: serviceUrl,
          url: path,
          method: 'GET',
          headers: { 'X-Auth-Token': getAuthTokenId() }
        },
        additionalAttributes
      );
      return axios(requestAttributes);
    });
  }

  /**
   * Gets a Workflow executions
   * Mistral API: GET /v2/executions
   * @return {array} of Executions.
   */
  getWorkflowExecutions() {
    return this.defaultRequest('/executions', {
      params: { include_output: true }
    })
      .then(response => {
        response.data.executions.map(execution =>
          parseExecutionAttrs(execution)
        );
        return when.resolve(response.data.executions);
      })
      .catch(e => handleErrors(e));
  }

  /**
   * Deletes a Workflow execution
   * Mistral API: DELETE /v2/executions/:execution_id
   * @param {executionId} Execution ID
   * @param {patch} Partial execution objects carrying the changes
   */
  updateWorkflowExecution(executionId, patch) {
    return this.defaultRequest('/executions/' + executionId, {
      method: 'PUT',
      data: patch
    })
      .then(response => {
        const execution = parseExecutionAttrs(response.data);
        return when.resolve(execution);
      })
      .catch(e => handleErrors(e));
  }

  /**
   * Starts a new Workflow execution
   * Mistral API: POST /v2/executions
   * @param {string} workflowName - Workflow name
   * @param {object} input - Workflow input object
   * @return {object} Execution.
   */
  runWorkflow(workflowName, input = {}) {
    return this.defaultRequest('/executions', {
      method: 'POST',
      data: {
        workflow_name: workflowName,
        input: input
      }
    })
      .then(response => {
        response.data = parseExecutionAttrs(response.data);

        if (response.data.state === 'ERROR') {
          return when.reject(new MistralExecutionError(response));
        } else if (workflowName === MistralConstants.VALIDATIONS_RUN) {
          // Running validation is special case when whole execution needs to be returned
          return when.resolve(response.data);
        } else {
          return when.resolve(response.data.output.result);
        }
      })
      .catch(e => {
        if (e.name === 'MistralExecutionError') {
          return when.reject(e);
        } else {
          return handleErrors(e);
        }
      });
  }

  /**
   * Starts a new Action execution
   * Mistral API: POST /v2/action_executions
   * @param {string} actionName - Name of the Action to be executed
   * @param {object} input - Action input object
   * @return {object} Action Execution.
   */
  runAction(actionName, input = {}) {
    return this.defaultRequest('/action_executions', {
      method: 'POST',
      data: {
        name: actionName,
        input: input,
        params: {
          save_result: true,
          run_sync: true
        }
      }
    })
      .then(response => {
        response.data.output = JSON.parse(response.data.output).result;
        if (response.data.state === 'ERROR') {
          return when.reject(new MistralExecutionError(response));
        } else {
          return when.resolve(response.data.output);
        }
      })
      .catch(e => {
        if (e.name === 'MistralExecutionError') {
          return when.reject(e);
        } else {
          return handleErrors(e);
        }
      });
  }
}

const handleErrors = e => {
  if (e.response && e.response.status === 401) {
    return when.reject(new AuthenticationError(e));
  } else if (e.response) {
    return when.reject(new MistralApiError(e));
  } else if (e.request) {
    return when.reject(
      new ConnectionError(
        'Connection to Mistral API could not be established',
        e
      )
    );
  } else {
    return when.reject(e);
  }
};

// input, output and params aren't parsed from Mistral
const parseExecutionAttrs = execution => {
  execution.input = JSON.parse(execution.input);
  execution.output = JSON.parse(execution.output);
  execution.params = JSON.parse(execution.params);
  return execution;
};

export default new MistralApiService();
