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

import { normalize, arrayOf } from 'normalizr';

import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NotificationActions from './NotificationActions';
import WorkflowExecutionsConstants
  from '../constants/WorkflowExecutionsConstants';
import {
  workflowExecutionSchema
} from '../normalizrSchemas/workflowExecutions';
import logger from '../services/logger';

export default {
  fetchWorkflowExecutions() {
    return (dispatch, getState) => {
      dispatch(this.fetchWorkflowExecutionsPending());
      MistralApiService.getWorkflowExecutions()
        .then(response => {
          const executions = normalize(
            response.executions,
            arrayOf(workflowExecutionSchema)
          ).entities.executions || {};
          dispatch(this.fetchWorkflowExecutionsSuccess(executions));
        })
        .catch(error => {
          logger.error(
            'Error in WorkflowExecutionsActions.fetchWorkflowExecutions',
            error
          );
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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

  updateWorkflowExecution(id, patch) {
    return (dispatch, getState) => {
      dispatch(this.updateWorkflowExecutionPending(id, patch));
      MistralApiService.updateWorkflowExecution(id, patch)
        .then(response => {
          dispatch(this.addWorkflowExecution(response));
        })
        .catch(error => {
          logger.error(
            'Error in WorkflowExecutionsActions.updateWorkflowExecution',
            error
          );
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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
