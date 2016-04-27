import { normalize, arrayOf } from 'normalizr';

import NotificationActions from './NotificationActions';
import ValidationsApiService from '../services/ValidationsApiService';
import ValidationsApiErrorHandler from '../services/ValidationsApiErrorHandler';
import ValidationsConstants from '../constants/ValidationsConstants';
import { validationStageSchema } from '../normalizrSchemas/validations';

export default {
  fetchValidationStages() {
    return (dispatch, getState) => {
      dispatch(this.fetchValidationStagesPending());
      ValidationsApiService.getStages().then((response) => {
        response = normalize(response, arrayOf(validationStageSchema));
        dispatch(this.fetchValidationStagesSuccess(response));
      }).catch((error) => {
        console.error('Error in ValidationActions.fetchValidationStages', error.stack || error); //eslint-disable-line no-console
        dispatch(this.fetchValidationStagesFailed());
        let errorHandler = new ValidationsApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  fetchValidationStagesPending() {
    return {
      type: ValidationsConstants.FETCH_VALIDATION_STAGES_PENDING
    };
  },

  fetchValidationStagesSuccess(stages) {
    return {
      type: ValidationsConstants.FETCH_VALIDATION_STAGES_SUCCESS,
      payload: stages
    };
  },

  fetchValidationStagesFailed() {
    return {
      type: ValidationsConstants.FETCH_VALIDATION_STAGES_FAILED
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
