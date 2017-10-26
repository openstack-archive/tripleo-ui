/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { defineMessages } from 'react-intl';
import { normalize, arrayOf } from 'normalizr';
import yaml from 'js-yaml';

import EnvironmentConfigurationConstants
  from '../constants/EnvironmentConfigurationConstants';
import { handleErrors } from './ErrorActions';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from '../actions/NotificationActions';
import { topicSchema } from '../normalizrSchemas/environmentConfiguration';
import MistralConstants from '../constants/MistralConstants';
import SwiftApiService from '../services/SwiftApiService';

const messages = defineMessages({
  envConfigUpdatedNotificationMessage: {
    id: 'EnvironmentConfigurationActions.envConfigUpdatedNotificationMessage',
    defaultMessage: 'The Environment Configuration has been successfully updated.'
  },
  envConfigUpdatedNotificationTitle: {
    id: 'EnvironmentConfigurationActions.envConfigUpdatedNotificationTitle',
    defaultMessage: 'Environment Configuration updated'
  }
});

export default {
  fetchEnvironmentConfiguration(planName, redirect) {
    return dispatch => {
      dispatch(this.fetchEnvironmentConfigurationPending());
      return dispatch(
        MistralApiService.runAction(MistralConstants.CAPABILITIES_GET, {
          container: planName
        })
      )
        .then(response => {
          const entities = normalize(response, arrayOf(topicSchema))
            .entities || {};
          dispatch(this.fetchEnvironmentConfigurationSuccess(entities));
        })
        .catch(error => {
          if (redirect) {
            redirect();
          }
          dispatch(
            handleErrors(error, 'Deployment configuration could not be loaded')
          );
          dispatch(this.fetchEnvironmentConfigurationFailed());
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

  updateEnvironmentConfiguration(planName, data, formFields) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.updateEnvironmentConfigurationPending());
      return dispatch(
        MistralApiService.runAction(MistralConstants.CAPABILITIES_UPDATE, {
          environments: data,
          container: planName
        })
      )
        .then(response => {
          const enabledEnvs = response.environments.map(env => env.path);
          dispatch(this.updateEnvironmentConfigurationSuccess(enabledEnvs));
          dispatch(
            NotificationActions.notify({
              title: formatMessage(messages.envConfigUpdatedNotificationTitle),
              message: formatMessage(
                messages.envConfigUpdatedNotificationMessage
              ),
              type: 'success'
            })
          );
        })
        .catch(error => {
          dispatch(
            handleErrors(
              error,
              'Deployment configuration could not be updated',
              false
            )
          );
          dispatch(
            this.updateEnvironmentConfigurationFailed([
              {
                title: 'Configuration could not be updated',
                message: error.message
              }
            ])
          );
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

  updateEnvironmentConfigurationFailed(formErrors = [], formFieldErrors = {}) {
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
      dispatch(SwiftApiService.getObject(planName, environmentPath))
        .then(response => {
          const {
            resource_registry,
            parameter_defaults
          } = yaml.safeLoad(response, {
            filename: environmentPath,
            json: true
          });
          dispatch(
            this.fetchEnvironmentSuccess({
              file: environmentPath,
              resourceRegistry: resource_registry,
              parameterDefaults: parameter_defaults
            })
          );
        })
        .catch(error => {
          dispatch(
            handleErrors(
              error,
              `Environment ${environmentPath} could not be loaded`,
              false
            )
          );
          dispatch(
            this.fetchEnvironmentFailed(environmentPath, {
              title: `Environment ${environmentPath} could not be loaded`,
              message: error.message
            })
          );
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
