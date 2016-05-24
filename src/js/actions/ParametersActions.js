import { browserHistory } from 'react-router';
import NotificationActions from '../actions/NotificationActions';
import ParametersConstants from '../constants/ParametersConstants';
import TripleOApiService from '../services/TripleOApiService';
import TripleOApiErrorHandler from '../services/TripleOApiErrorHandler';

export default {
  fetchParametersPending() {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_PENDING
    };
  },

  fetchParametersSuccess(parameters) {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_SUCCESS,
      payload: parameters
    };
  },

  fetchParametersFailed(formErrors, formFieldErrors) {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_FAILED
    };
  },

  fetchParameters(planName) {
    return dispatch => {
      dispatch(this.fetchParametersPending());
      TripleOApiService.getPlanParameters(planName).then(response => {
        dispatch(this.fetchParametersSuccess(response.parameters));
      }).catch(error => {
        dispatch(this.fetchParametersFailed());
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  updateParametersPending() {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_PENDING
    };
  },

  updateParametersSuccess(parameters) {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_PENDING,
      payload: parameters
    };
  },

  updateParametersFailed(formErrors, formFieldErrors) {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_FAILED,
      payload: {
        formErrors: formErrors,
        formFieldErrors: formFieldErrors
      }
    };
  },

  updateParameters(planName, data, inputFieldNames, url) {
    return dispatch => {
      dispatch(this.updateParametersPending());
      TripleOApiService.updatePlanParameters(planName, data).then(response => {
        dispatch(this.updateParametersSuccess(response.parameters));
        dispatch(NotificationActions.notify({
          title: 'Parameters updated',
          message: 'The Deployment parameters have been successfully updated',
          type: 'success'
        }));
        browserHistory.push(url);
      }).catch(error => {
        let errorHandler = new TripleOApiErrorHandler(error, inputFieldNames);
        dispatch(this.updateParametersFailed(errorHandler.errors, errorHandler.formFieldErrors));
      });
    };
  }
};
