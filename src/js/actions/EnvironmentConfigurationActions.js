import { normalize, arrayOf } from 'normalizr';

import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
import history from '../history';
import NotificationActions from '../actions/NotificationActions';
import TripleOApiService from '../services/TripleOApiService';
import TripleOApiErrorHandler from '../services/TripleOApiErrorHandler';
import { topicSchema } from '../normalizrSchemas/environmentConfiguration';

export default {

  fetchEnvironmentConfiguration(planName, parentPath) {
    return dispatch => {
      dispatch(this.fetchEnvironmentConfigurationPending());
      TripleOApiService.getPlanEnvironments(planName).then((response) => {
        const entities = normalize(response.environments.topics, arrayOf(topicSchema)).entities;
        dispatch(this.fetchEnvironmentConfigurationSuccess(entities));
      }).catch(error => {
        console.error('Error retrieving EnvironmentConfigurationActions.fetchEnvironment', //eslint-disable-line no-console
                      error.stack || error); //eslint-disable-line no-console
        if(parentPath) { history.pushState(null, parentPath); }
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

  fetchEnvironmentConfigurationSuccess(entities) {
    return {
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_SUCCESS,
      payload: entities
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
      TripleOApiService.updatePlanEnvironments(planName, data).then((response) => {
        const entities = normalize(response.environments.topics, arrayOf(topicSchema)).entities;
        dispatch(this.updateEnvironmentConfigurationSuccess(entities));
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

  updateEnvironmentConfigurationSuccess(entities) {
    return {
      type: EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS,
      payload: entities
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
