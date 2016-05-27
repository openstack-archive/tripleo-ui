import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getServiceUrl, getAuthTokenId } from './utils';

class MistralApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'mistral').then((serviceUrl) => {
      let requestAttributes = _.merge({
        url: `${serviceUrl}${path}`,
        headers: { 'X-Auth-Token': getAuthTokenId() },
        crossOrigin: true,
        contentType: 'application/json',
        type: 'json',
        method: 'GET'
      }, additionalAttributes);
      return when(request(requestAttributes));
    });
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
        input: JSON.stringify(input),
        params: JSON.stringify({save_result: true})
      })
    });
  }
}

export default new MistralApiService();
