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
import { normalize } from 'normalizr';
import { startSubmit, stopSubmit } from 'redux-form';
import yaml from 'js-yaml';

import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
import { handleErrors } from './ErrorActions';
import MistralApiService from '../services/MistralApiService';
import { notify } from '../actions/NotificationActions';
import { topicSchema } from '../normalizrSchemas/environmentConfiguration';
import MistralConstants from '../constants/MistralConstants';
import SwiftApiService from '../services/SwiftApiService';

const messages = defineMessages({
  envConfigUpdatedNotificationMessage: {
    id: 'EnvironmentConfigurationActions.envConfigUpdatedNotificationMessage',
    defaultMessage:
      'The Environment Configuration has been successfully updated.'
  },
  envConfigUpdatedNotificationTitle: {
    id: 'EnvironmentConfigurationActions.envConfigUpdatedNotificationTitle',
    defaultMessage: 'Environment Configuration updated'
  },
  configurationNotUpdatedError: {
    id: 'EnvironmentConfigurationActions.configurationNotUpdatedError',
    defaultMessage: 'Deployment configuration could not be updated'
  }
});

export const fetchEnvironmentConfiguration = (
  planName,
  redirect
) => dispatch => {
  dispatch(fetchEnvironmentConfigurationPending());
  return dispatch(
    MistralApiService.runAction(MistralConstants.CAPABILITIES_GET, {
      container: planName
    })
  )
    .then(response => {
      const entities = normalize(response, [topicSchema]).entities || {};
      dispatch(fetchEnvironmentConfigurationSuccess(entities));
    })
    .catch(error => {
      if (redirect) {
        redirect();
      }
      dispatch(
        handleErrors(error, 'Deployment configuration could not be loaded')
      );
      dispatch(fetchEnvironmentConfigurationFailed());
    });
};

export const fetchEnvironmentConfigurationPending = () => ({
  type:
    EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_PENDING
});

export const fetchEnvironmentConfigurationSuccess = entities => ({
  type:
    EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_SUCCESS,
  payload: entities
});

export const fetchEnvironmentConfigurationFailed = environment => ({
  type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_FAILED
});

export const updateEnvironmentConfiguration = (planName, data, redirect) => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('environmentConfigurationForm'));
  return dispatch(
    MistralApiService.runAction(MistralConstants.CAPABILITIES_UPDATE, {
      environments: data,
      container: planName,
      sort_environments: true
    })
  )
    .then(response => {
      const enabledEnvs = response.environments.map(env => env.path);
      dispatch(updateEnvironmentConfigurationSuccess(enabledEnvs));
      dispatch(stopSubmit('environmentConfigurationForm'));
      dispatch(
        notify({
          title: formatMessage(messages.envConfigUpdatedNotificationTitle),
          message: formatMessage(messages.envConfigUpdatedNotificationMessage),
          type: 'success'
        })
      );
      redirect && redirect();
    })
    .catch(error => {
      dispatch(
        stopSubmit('environmentConfigurationForm', {
          _error: {
            title: formatMessage(messages.configurationNotUpdatedError),
            message: error.message
          }
        })
      );
    });
};

export const updateEnvironmentConfigurationSuccess = enabledEnvironments => ({
  type:
    EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS,
  payload: enabledEnvironments
});

export const fetchEnvironment = (planName, environmentPath) => dispatch => {
  dispatch(fetchEnvironmentPending(environmentPath));
  dispatch(SwiftApiService.getObject(planName, environmentPath))
    .then(response => {
      const { resource_registry, parameter_defaults } = yaml.safeLoad(
        response,
        {
          filename: environmentPath,
          json: true
        }
      );
      dispatch(
        fetchEnvironmentSuccess({
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
        fetchEnvironmentFailed(environmentPath, {
          title: `Environment ${environmentPath} could not be loaded`,
          message: error.message
        })
      );
    });
};

export const fetchEnvironmentPending = environmentPath => ({
  type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_PENDING,
  payload: environmentPath
});

export const fetchEnvironmentSuccess = environment => ({
  type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_SUCCESS,
  payload: environment
});

export const fetchEnvironmentFailed = (environmentPath, error) => ({
  type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_FAILED,
  payload: {
    environmentPath,
    error
  }
});
