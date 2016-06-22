import { normalize, arrayOf } from 'normalizr';

import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import ValidationsApiService from '../services/ValidationsApiService';
import ValidationsApiErrorHandler from '../services/ValidationsApiErrorHandler';
import ValidationsConstants from '../constants/ValidationsConstants';
import { validationSchema } from '../normalizrSchemas/validations';

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

  runValidation(uuid) {
    return dispatch => {
      dispatch(this.updateValidationStatus(uuid, 'running'));
      ValidationsApiService.runValidation(uuid).then((response) => {
        console.log(response); //eslint-disable-line no-console
      }).catch((error) => {
        console.error('Error in ValidationActions.runValidaton', error.stack); //eslint-disable-line no-console
        let errorHandler = new ValidationsApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.updateValidationStatus(uuid, 'error'));
      });
    };
  },

  stopValidation(uuid) {
    return dispatch => {
      dispatch(this.updateValidationStatus(uuid, 'failed'));
      ValidationsApiService.stopValidation(uuid).then((response) => {
        console.log(response); //eslint-disable-line no-console
      }).catch((error) => {
        console.error('Error in ValidationActions.stopValidation', error.stack); //eslint-disable-line no-console
        let errorHandler = new ValidationsApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.updateValidationStatus(uuid, 'error'));
      });
    };
  },

  updateValidationStatus(uuid, status) {
    return {
      type: ValidationsConstants.UPDATE_VALIDATION_STATUS,
      payload: {
        uuid,
        status
      }
    };
  }
};
