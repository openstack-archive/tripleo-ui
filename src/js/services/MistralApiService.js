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

import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getServiceUrl, getAuthTokenId } from './utils';

class MistralApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'mistral').then(serviceUrl => {
      let requestAttributes = _.merge(
        {
          url: `${serviceUrl}${path}`,
          headers: { 'X-Auth-Token': getAuthTokenId() },
          crossOrigin: true,
          contentType: 'application/json',
          type: 'json',
          method: 'GET'
        },
        additionalAttributes
      );
      return when(request(requestAttributes));
    });
  }

  /**
   * Gets a Workflow executions
   * Mistral API: GET /v2/executions
   * @param {string} mistralUrl - Mistral API service base url
   * @param {string} authTokenId - keystone authentication token ID
   * @return {array} of Executions.
   */
  getWorkflowExecutions() {
    return this.defaultRequest('/executions?include_output=true');
  }

  /**
   * Gets a Workflow execution
   * Mistral API: GET /v2/executions/:execution_id
   * @param {string} mistralUrl - Mistral API service base url
   * @param {string} authTokenId - keystone authentication token ID
   * @return {object} Execution.
   */
  getWorkflowExecution(executionId) {
    return this.defaultRequest('/executions/' + executionId);
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
      data: JSON.stringify(patch)
    });
  }

  /**
   * Starts a new Workflow execution
   * Mistral API: POST /v2/executions
   * @param {string} mistralUrl - Mistral API service base url
   * @param {string} authTokenId - keystone authentication token ID
   * @param {string} workflowName - Workflow name
   * @param {object} input - Workflow input object
   * @return {object} Execution.
   */
  runWorkflow(workflowName, input = {}) {
    return this.defaultRequest('/executions', {
      method: 'POST',
      data: JSON.stringify({
        workflow_name: workflowName,
        input: JSON.stringify(input)
      })
    });
  }

  /**
   * Starts a new Action execution
   * Mistral API: POST /v2/action_executions
   * @param {string} mistralUrl - Mistral API service base url
   * @param {string} authTokenId - keystone authentication token ID
   * @param {string} actionName - Name of the Action to be executed
   * @param {object} input - Action input object
   * @return {object} Action Execution.
   */
  runAction(actionName, input = {}) {
    return this.defaultRequest('/action_executions', {
      method: 'POST',
      data: JSON.stringify({
        name: actionName,
        input: input,
        params: {
          save_result: true,
          run_sync: true
        }
      })
    }).then(response => {
      if (response.state === 'SUCCESS') {
        return when.resolve(response);
      } else {
        return when.reject({
          status: 'Action ERROR',
          message: JSON.parse(response.output).result
        });
      }
    });
  }
}

export default new MistralApiService();
