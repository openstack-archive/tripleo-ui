import { browserHistory } from 'react-router';

import NotificationActions from '../actions/NotificationActions';
import ParametersConstants from '../constants/ParametersConstants';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';

export default {
  fetchParametersPending() {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_PENDING
    };
  },

  fetchParametersSuccess(entities) {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_SUCCESS,
      payload: entities
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
      MistralApiService.runAction('tripleo.get_parameters', { container: planName })
      .then(response => {
        // TODO(jtomasek): mistralParameters are supposed to be part of the action result,
        // once it is so, update this to set resourceTree and mistralParameters correctly
        const resourceTree = JSON.parse(response.output).result;
        const mistralParameters = {};
        dispatch(this.fetchParametersSuccess({ resourceTree, mistralParameters }));
      }).catch(error => {
        dispatch(this.fetchParametersFailed());
        console.error('Error in ParametersActions.fetchParameters', error.stack || error); //eslint-disable-line no-console
        let errorHandler = new MistralApiErrorHandler(error);
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
      MistralApiService.runAction('tripleo.update_parameters',
                                  { container: planName, parameters: data })
      .then(response => {
        dispatch(this.updateParametersSuccess(response.parameters));
        dispatch(NotificationActions.notify({
          title: 'Parameters updated',
          message: 'The Deployment parameters have been successfully updated',
          type: 'success'
        }));
        browserHistory.push(url);
      }).catch(error => {
        let errorHandler = new MistralApiErrorHandler(error, inputFieldNames);
        dispatch(this.updateParametersFailed(errorHandler.errors, errorHandler.formFieldErrors));
      });
    };
  }
};
