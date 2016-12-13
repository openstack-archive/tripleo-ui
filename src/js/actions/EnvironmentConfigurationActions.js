import { normalize, arrayOf } from 'normalizr';
import yaml from 'js-yaml';

import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
import { browserHistory } from 'react-router';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from '../actions/NotificationActions';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import { topicSchema } from '../normalizrSchemas/environmentConfiguration';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logger';
import SwiftApiErrorHandler from '../services/SwiftApiErrorHandler';
import SwiftApiService from '../services/SwiftApiService';

export default {

  fetchEnvironmentConfiguration(planName, redirectPath) {
    return dispatch => {
      dispatch(this.fetchEnvironmentConfigurationPending());
      MistralApiService.runAction(MistralConstants.CAPABILITIES_GET, { container: planName })
      .then(response => {
        const entities = normalize(JSON.parse(response.output).result,
                         arrayOf(topicSchema)).entities || {};
        dispatch(this.fetchEnvironmentConfigurationSuccess(entities));
      }).catch(error => {
        logger.error('Error retrieving EnvironmentConfigurationActions.fetchEnvironment',
                      error.stack || error);
        if (redirectPath) { browserHistory.push(redirectPath); }
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

  updateEnvironmentConfiguration(planName, data, formFields, redirectPath) {
    return dispatch => {
      dispatch(this.updateEnvironmentConfigurationPending());
      MistralApiService.runAction(MistralConstants.CAPABILITIES_UPDATE,
                                  { environments: data, container: planName })
      .then(response => {
        const enabledEnvs = JSON.parse(response.output).result.environments.map(env => env.path);
        dispatch(this.updateEnvironmentConfigurationSuccess(enabledEnvs));
        if (redirectPath) { browserHistory.push(redirectPath); }
        dispatch(NotificationActions.notify({
          title: 'Environment Configuration updated',
          message: 'The Environment Configuration has been successfully updated',
          type: 'success'
        }));
      }).catch((error) => {
        logger.error('Error in EnvironmentConfigurationActions.updateEnvironment',
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
  },

  fetchEnvironment(planName, environmentPath) {
    return dispatch => {
      dispatch(this.fetchEnvironmentPending(environmentPath));
      SwiftApiService.getObject(planName, environmentPath)
      .then(response => {
        const { resource_registry, parameter_defaults } =
          yaml.safeLoad(response.responseText, { filename: environmentPath, json: true });
        dispatch(this.fetchEnvironmentSuccess({ file: environmentPath,
                                                resourceRegistry: resource_registry,
                                                parameterDefaults: parameter_defaults }));
      }).catch(error => {
        if (error.name && error.name === 'YAMLException') {
          logger.error(`Error parsing ${environmentPath} to JSON`, error);
          dispatch(this.fetchEnvironmentFailed(environmentPath, error));
        } else {
          logger.error(`Error EnvironmentConfigurationActions.fetchEnvironment ${environmentPath}`,
                       error, error.stack);
          dispatch(this.fetchEnvironmentFailed(environmentPath));
          let errorHandler = new SwiftApiErrorHandler(error);
          errorHandler.errors.forEach((error) => {
            dispatch(NotificationActions.notify(error));
          });
        }
      });
    };
  },

  fetchEnvironmentPending(environmentPath) {
    return {
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_PENDING,
      payload: environmentPath
    };
  },

  fetchEnvironmentSuccess(environment) {
    return {
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_SUCCESS,
      payload: environment
    };
  },

  fetchEnvironmentFailed(environmentPath, error) {
    return {
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_FAILED,
      payload: {
        environmentPath,
        error
      }
    };
  }
};
