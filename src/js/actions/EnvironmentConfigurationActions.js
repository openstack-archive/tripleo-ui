import { normalize, arrayOf } from 'normalizr';

import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
import { browserHistory } from 'react-router';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from '../actions/NotificationActions';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import { topicSchema } from '../normalizrSchemas/environmentConfiguration';

export default {

  fetchEnvironmentConfiguration(planName, parentPath) {
    return dispatch => {
      dispatch(this.fetchEnvironmentConfigurationPending());
      MistralApiService.runAction('tripleo.get_capabilities', { container: planName })
      .then(response => {
        const entities = normalize(JSON.parse(response.output).result,
                         arrayOf(topicSchema)).entities || {};
        dispatch(this.fetchEnvironmentConfigurationSuccess(entities));
      }).catch(error => {
        console.error('Error retrieving EnvironmentConfigurationActions.fetchEnvironment', //eslint-disable-line no-console
                      error.stack || error); //eslint-disable-line no-console
        if(parentPath) { browserHistory.push(parentPath); }
        dispatch(this.fetchEnvironmentConfigurationFailed());
        let errorHandler = new MistralApiErrorHandler(error);
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
      MistralApiService.runAction('tripleo.update_capabilities',
                                  { environments: data, container: planName })
      .then(response => {
        const enabledEnvs = JSON.parse(response.output).result.environments.map(env => env.path);
        dispatch(this.updateEnvironmentConfigurationSuccess(enabledEnvs));
        if (parentPath) { browserHistory.push(parentPath); }
        dispatch(NotificationActions.notify({
          title: 'Environment Configuration updated',
          message: 'The Environment Configuration has been successfully updated',
          type: 'success'
        }));
      }).catch((error) => {
        console.error('Error in EnvironmentConfigurationActions.updateEnvironment', //eslint-disable-line no-console
                      error.stack || error);
        let errorHandler = new MistralApiErrorHandler(error, formFields);
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

  updateEnvironmentConfigurationSuccess(enabledEnvironments) {
    return {
      type: EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS,
      payload: enabledEnvironments
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
