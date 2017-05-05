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
import { omit } from 'lodash';

import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import WorkflowExecutionsActions from './WorkflowExecutionsActions';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import ValidationsConstants from '../constants/ValidationsConstants';
import { validationSchema } from '../normalizrSchemas/validations';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logger';

export default {
  fetchValidations() {
    return (dispatch, getState) => {
      dispatch(this.fetchValidationsPending());
      MistralApiService.runAction(MistralConstants.VALIDATIONS_LIST)
        .then(response => {
          const actionResult = JSON.parse(response.output).result;
          const validations = normalize(actionResult, arrayOf(validationSchema))
            .entities.validations || {};
          dispatch(this.fetchValidationsSuccess(validations));
        })
        .catch(error => {
          logger.error(
            'Error in ValidationsActions.fetchValidations',
            error.stack || error
          );
          dispatch(this.fetchValidationsFailed());
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
        });
    };
  },

  fetchValidationsPending() {
    return {
      type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
    };
  },

  fetchValidationsSuccess(validations) {
    return {
      type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
      payload: validations
    };
  },

  fetchValidationsFailed() {
    return {
      type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
    };
  },

  runValidation(id, currentPlanName) {
    return (dispatch, getState) => {
      MistralApiService.runWorkflow(MistralConstants.VALIDATIONS_RUN, {
        validation_name: id,
        plan: currentPlanName
      })
        .then(response => {
          if (response.state === 'ERROR') {
            dispatch(
              NotificationActions.notify({
                title: 'Error running Validation',
                message: response.state_info
              })
            );
            dispatch(WorkflowExecutionsActions.addWorkflowExecution(response));
          } else {
            dispatch(WorkflowExecutionsActions.addWorkflowExecution(response));
          }
        })
        .catch(error => {
          logger.error(
            'Error in ValidationsActions.runValidation',
            error.stack || error
          );
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
        });
    };
  },

  runValidationMessage(messagePayload) {
    return (dispatch, getState) => {
      // convert messagePayload to execution-like response
      const execution = {
        id: messagePayload.execution.id,
        input: JSON.stringify(messagePayload.execution.input),
        output: JSON.stringify(omit(messagePayload, 'execution')),
        state: messagePayload.status,
        workflow_name: MistralConstants.VALIDATIONS_RUN
      };
      dispatch(WorkflowExecutionsActions.addWorkflowExecution(execution));
    };
  },

  runValidationGroups(groups, currentPlanName) {
    return (dispatch, getState) => {
      MistralApiService.runWorkflow(MistralConstants.VALIDATIONS_RUN_GROUPS, {
        group_names: groups,
        plan: currentPlanName
      })
        .then(response => {
          if (response.state === 'ERROR') {
            dispatch(
              NotificationActions.notify({
                title: 'Error running Validation',
                message: response.state_info
              })
            );
          }
        })
        .catch(error => {
          logger.error(
            'Error in ValidationsActions.runValidationGroups',
            error.stack || error
          );
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
        });
    };
  }
};
