import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
import history from '../history';
import NotificationActions from '../actions/NotificationActions';
import TripleOApiService from '../services/TripleOApiService';
import TripleOApiErrorHandler from '../services/TripleOApiErrorHandler';

export default {

  fetchEnvironmentConfiguration(planName, parentPath) {
    return dispatch => {
      dispatch(this.fetchEnvironmentConfigurationPending());
      TripleOApiService.getPlanEnvironments(planName).then((response) => {
        dispatch(this.fetchEnvironmentConfigurationSuccess(response.environments));
      }).catch(error => {
        console.error('Error retrieving EnvironmentConfigurationActions.fetchEnvironment', error); //eslint-disable-line no-console
        history.pushState(null, parentPath);
        dispatch(this.fetchEnvironmentConfigurationFailed());
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  fetchEnvironmentConfigurationPending() {
    return {
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_PENDING
    };
  },

  fetchEnvironmentConfigurationSuccess(environment) {
    return {
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_SUCCESS,
      payload: environment
    };
  },

  fetchEnvironmentConfigurationFailed(environment) {
    return {
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_FAILED
    };
  },

  updateEnvironmentConfiguration(planName, data, formFields, parentPath) {
    return dispatch => {
      dispatch(this.updateEnvironmentConfigurationPending());
      TripleOApiService.updateAndDeletePlanEnvironments(planName, data).then((response) => {
        dispatch(this.updateEnvironmentConfigurationSuccess(response.environments));
        history.pushState(null, parentPath);
        dispatch(NotificationActions.notify({
          title: 'Environment Configuration updated',
          message: 'The Environment Configuration has been successfully updated',
          type: 'success'
        }));
      }).catch((error) => {
        console.error('Error in EnvironmentConfigurationActions.updateEnvironment', //eslint-disable-line no-console
                      error.stack || error);
        let errorHandler = new TripleOApiErrorHandler(error, formFields);
        dispatch(this.updateEnvironmentConfigurationFailed(errorHandler.errors,
                                                           errorHandler.formFieldErrors));
      });

    };
  },

  updateEnvironmentConfigurationPending() {
    return {
      type: EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_PENDING
    };
  },

  updateEnvironmentConfigurationSuccess(environment) {
    return {
      type: EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS,
      payload: environment
    };
  },

  updateEnvironmentConfigurationFailed(formErrors, formFieldErrors) {
    return {
      type: EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_FAILED,
      payload: {
        formErrors,
        formFieldErrors
      }
    };
  }
};
