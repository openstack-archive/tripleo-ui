import { normalize, arrayOf } from 'normalizr';
import { fromJS } from 'immutable';

import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import WorkflowExecutionsActions from './WorkflowExecutionsActions';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import ValidationsConstants from '../constants/ValidationsConstants';
import { validationSchema } from '../normalizrSchemas/validations';
import { WorkflowExecution } from '../immutableRecords/workflowExecutions';

export default {
  fetchValidations() {
    return (dispatch, getState) => {
      dispatch(this.fetchValidationsPending());
      MistralApiService.runAction('tripleo.list_validations').then((response) => {

        const actionResult = JSON.parse(response.output).result;
        const validations = normalize(actionResult,
                                      arrayOf(validationSchema)).entities.validations || {};
        dispatch(this.fetchValidationsSuccess(validations));
      }).catch((error) => {
        console.error('Error in ValidationActions.fetchValidations', error.stack || error); //eslint-disable-line no-console
        dispatch(this.fetchValidationsFailed());
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
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
      MistralApiService.runWorkflow('tripleo.validations.v1.run_validation',
                                    { validation_name: id,
                                      plan: currentPlanName })
      .then((response) => {
        if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error running Validation',
                                                message: response.state_info }));
          dispatch(WorkflowExecutionsActions.addWorkflowExecution(response));
        } else {
          dispatch(WorkflowExecutionsActions.addWorkflowExecution(response));
        }
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  runValidationMessage(messagePayload) {
    return (dispatch, getState) => {
      const execution = new WorkflowExecution(fromJS(messagePayload.execution))
                          .set('workflow_name', 'tripleo.validations.v1.run_validation')
                          .set('state', messagePayload.status)
                          .set('output', fromJS({...messagePayload}).delete('execution'));
      dispatch(WorkflowExecutionsActions.addWorkflowExecutionFromMessage(execution));
    };
  }
};
