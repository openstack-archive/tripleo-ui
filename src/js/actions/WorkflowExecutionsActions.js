import { normalize, arrayOf } from 'normalizr';

import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import WorkflowExecutionsConstants from '../constants/WorkflowExecutionsConstants';
import NotificationActions from './NotificationActions';
import { workflowExecutionSchema } from '../normalizrSchemas/workflowExecutions';

export default {
  fetchWorkflowExecutions() {
    return (dispatch, getState) => {
      dispatch(this.fetchWorkflowExecutionsPending());
      MistralApiService.getWorkflowExecutions()
      .then((response) => {
        const executions = normalize(response.executions,
                                     arrayOf(workflowExecutionSchema)).entities.executions || {};
        dispatch(this.fetchWorkflowExecutionsSuccess(executions));
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.fetchWorkflowExecutionsFailed());
      });
    };
  },

  fetchWorkflowExecutionsPending() {
    return {
      type: WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_PENDING
    };
  },

  fetchWorkflowExecutionsSuccess(executions) {
    return {
      type: WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_SUCCESS,
      payload: executions
    };
  },

  fetchWorkflowExecutionsFailed() {
    return {
      type: WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_FAILED
    };
  }
};
