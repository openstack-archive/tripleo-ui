import { normalize, arrayOf } from 'normalizr';

import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
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
        console.log(validations);
        dispatch(this.fetchValidationsSuccess(validations));
      }).catch((error) => {
        console.error('Error in ValidationActions.fetchValidations', error.stack || error); //eslint-disable-line no-console
        dispatch(this.fetchValidationsFailed());
        let errorHandler = new ValidationsApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  // fetchValidationStages() {
  //   return (dispatch, getState) => {
  //     dispatch(this.fetchValidationStagesPending());
  //     ValidationsApiService.getStages().then((response) => {
  //       response = normalize(response, arrayOf(validationStageSchema));
  //       dispatch(this.fetchValidationStagesSuccess(response));
  //     }).catch((error) => {
  //       console.error('Error in ValidationActions.fetchValidationStages', error.stack || error); //eslint-disable-line no-console
  //       dispatch(this.fetchValidationStagesFailed());
  //       let errorHandler = new ValidationsApiErrorHandler(error);
  //       errorHandler.errors.forEach((error) => {
  //         dispatch(NotificationActions.notify(error));
  //       });
  //     });
  //   };
  // },

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

  runValidationStage(uuid) {
    return dispatch => {
      dispatch(this.updateValidationStageStatus(uuid, 'running'));
      dispatch(this.showValidationStage(uuid));
      ValidationsApiService.runStage(uuid).then((response) => {
      }).catch((error) => {
        console.error('Error in ValidationStage.runStage', error.stack); //eslint-disable-line no-console
        let errorHandler = new ValidationsApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.updateValidationStageStatus(uuid, 'error'));
      });
    };
  },

  toggleValidationStageVisibility(uuid) {
    return {
      type: ValidationsConstants.TOGGLE_VALIDATION_STAGE_VISIBILITY,
      payload: {
        uuid
      }
    };
  },

  showValidationStage(uuid) {
    return {
      type: ValidationsConstants.SHOW_VALIDATION_STAGE,
      payload: {
        uuid
      }
    };
  },

  updateValidationStageStatus(uuid, status) {
    return {
      type: ValidationsConstants.UPDATE_STAGE_STATUS,
      payload: {
        uuid,
        status
      }
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
