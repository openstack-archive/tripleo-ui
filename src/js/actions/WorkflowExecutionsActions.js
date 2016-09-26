import { normalize, arrayOf } from 'normalizr';

import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NotificationActions from './NotificationActions';
import WorkflowExecutionsConstants from '../constants/WorkflowExecutionsConstants';
import { workflowExecutionSchema } from '../normalizrSchemas/workflowExecutions';
import logger from '../services/logger';

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
        logger.error('Error in WorkflowExecutionsActions.fetchWorkflowExecutions',
                     error);
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
  },

  addWorkflowExecution(execution) {
    return {
      type: WorkflowExecutionsConstants.ADD_WORKFLOW_EXECUTION,
      payload: execution
    };
  },

  addWorkflowExecutionFromMessage(execution) {
    return {
      type: WorkflowExecutionsConstants.ADD_WORKFLOW_EXECUTION_FROM_MESSAGE,
      payload: execution
    };
  },

  updateWorkflowExecution(id, patch) {
    return (dispatch, getState) => {
      dispatch(this.updateWorkflowExecutionPending(id, patch));
      MistralApiService.updateWorkflowExecution(id, patch)
      .then((response) => {
        dispatch(this.addWorkflowExecution(response));
      }).catch((error) => {
        logger.error('Error in WorkflowExecutionsActions.updateWorkflowExecution',
                     error);
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  updateWorkflowExecutionPending(id, patch) {
    return {
      type: WorkflowExecutionsConstants.UPDATE_WORKFLOW_EXECUTION_PENDING,
      payload: {
        id,
        patch
      }
    };
  }
};
