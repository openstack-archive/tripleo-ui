/**
 * Copyright 2018 Red Hat Inc.
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

import { handleErrors } from './ErrorActions';
import MistralApiService from '../services/MistralApiService';
import WorkflowExecutionsActions from './WorkflowExecutionsActions';
import WorkflowExecutionConstants from '../constants/WorkflowExecutionsConstants';

/**
 * @param {string} name - Name of the Mistral workflow to execute
 * @param {object} input - Input for Mistral workflow
 * @param {function} onFinished - function to execute after workflow execution
 * @param {integer} timeout - time after which polling should start
 * is finished, execution object is passed as a parameter
 *
 * startWorkflow triggers the Mistral workflow, then sets the timeout after
 * which we start to poll for workflow execution, to get the result. timeout
 * is stored in redux store, so it is possible to cancel it in case a Zaqar
 * message arrives
 */
export const startWorkflow = (
  name,
  input,
  onFinished,
  timeout = 30000
) => dispatch =>
  dispatch(MistralApiService.runWorkflow(name, input)).then(execution => {
    dispatch(WorkflowExecutionsActions.addWorkflowExecution(execution));
    if (onFinished) {
      const timeout = setTimeout(
        () => dispatch(pollWorkflowExecution(execution.id, onFinished)),
        timeout
      );
      dispatch(setWorkflowTimeout(execution.id, timeout));
    }
    return Promise.resolve(execution);
  });

/**
 * @param {string} executionId
 * @param {function} onFinished - callback to execute after workflow execution
 * is finished, execution object is passed as a parameter
 */
export const pollWorkflowExecution = (executionId, onFinished) => dispatch =>
  dispatch(MistralApiService.getWorkflowExecution(executionId))
    .then(execution => {
      dispatch(WorkflowExecutionsActions.addWorkflowExecution(execution));
      if (execution.state === 'RUNNING') {
        const timeout = setTimeout(
          () => dispatch(pollWorkflowExecution(executionId, onFinished)),
          2500
        );
        dispatch(setWorkflowTimeout(executionId, timeout));
      } else {
        dispatch(cancelWorkflowTimeout(executionId));
        onFinished(execution);
      }
    })
    .catch(error =>
      dispatch(handleErrors(error, 'Execution could not be loaded'))
    );

/**
 * @param {string} executionId
 * @param {function} onFinished - callback to execute after workflow execution
 * is finished, execution object is passed as a parameter
 *
 * This action is dispatched after a Zaqar message arrives, it reacts to message
 * only in case when we know what to do with it and when it's execution is not
 * finished or we have no record of it. It cancels the existing poll timeout and
 * starts polling for execution itself.
 */
export const handleWorkflowMessage = (executionId, onFinished) => (
  dispatch,
  getState
) => {
  const execution = getState().executions.executions.get(executionId);
  // react to message only when we know what to do with it and when it's
  // execution is not finished or we have no record of it
  if (
    onFinished &&
    (execution === undefined || execution.state === 'RUNNING')
  ) {
    clearTimeout(getState().workflowExecutionMessageTimeouts.get(executionId));
    dispatch(cancelWorkflowTimeout(executionId));
    dispatch(pollWorkflowExecution(executionId, onFinished));
  }
};

export const setWorkflowTimeout = (executionId, timeout) => ({
  type: WorkflowExecutionConstants.SET_WORKFLOW_TIMEOUT,
  payload: { executionId, timeout }
});

export const cancelWorkflowTimeout = executionId => ({
  type: WorkflowExecutionConstants.CANCEL_WORKFLOW_TIMEOUT,
  payload: executionId
});
