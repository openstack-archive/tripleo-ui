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
import { startSubmit, stopSubmit } from 'redux-form';

import { handleErrors } from './ErrorActions';
import ParametersConstants from '../constants/ParametersConstants';
import MistralApiService from '../services/MistralApiService';
import MistralConstants from '../constants/MistralConstants';

const messages = defineMessages({
  parametersUpdatedNotficationTitle: {
    id: 'ParametersActions.parametersUpdatedNotficationTitle',
    defaultMessage: 'Parameters updated'
  },
  updateParametersFailed: {
    id: 'ParametersActions.updateParametersFailed',
    defaultMessage: 'Parameters could not be updated'
  },
  parametersUpdatedNotficationMessage: {
    id: 'ParametersActions.parametersUpdatedNotficationMessage',
    defaultMessage: 'The Deployment parameters have been successfully updated.'
  }
});

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

  fetchParameters(planName, redirect) {
    return dispatch => {
      dispatch(this.fetchParametersPending());
      return dispatch(
        MistralApiService.runAction(MistralConstants.PARAMETERS_GET, {
          container: planName
        })
      )
        .then(response => {
          const { resources, parameters } = response.heat_resource_tree;
          const mistralParameters = response.environment_parameters;
          dispatch(
            this.fetchParametersSuccess({
              resources,
              parameters,
              mistralParameters
            })
          );
        })
        .catch(error => {
          dispatch(this.fetchParametersFailed());
          if (redirect) {
            redirect();
          }
          dispatch(
            handleErrors(error, 'Deployment parameters could not be loaded')
          );
        });
    };
  },

  updateParametersSuccess(updatedParameters) {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_SUCCESS,
      payload: updatedParameters
    };
  },

  updateNodesAssignment(planName, data) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(startSubmit('nodesAssignment'));
      return dispatch(
        MistralApiService.runAction(MistralConstants.PARAMETERS_UPDATE, {
          container: planName,
          parameters: data
        })
      )
        .then(response => {
          const { resources, parameters } = response.heat_resource_tree;
          const mistralParameters = response.environment_parameters;
          dispatch(
            this.updateParametersSuccess({
              resources,
              parameters,
              mistralParameters
            })
          );
          dispatch(stopSubmit('nodesAssignment'));
        })
        .catch(error => {
          dispatch(
            stopSubmit('nodesAssignment', {
              _error: {
                title: formatMessage(messages.updateParametersFailed),
                message: error.message
              }
            })
          );
        });
    };
  },

  updateParameters(planName, data, redirect) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(startSubmit('parametersForm'));
      return dispatch(
        MistralApiService.runAction(MistralConstants.PARAMETERS_UPDATE, {
          container: planName,
          parameters: data
        })
      )
        .then(response => {
          const { resources, parameters } = response.heat_resource_tree;
          const mistralParameters = response.environment_parameters;
          dispatch(
            this.updateParametersSuccess({
              resources,
              parameters,
              mistralParameters
            })
          );
          dispatch(stopSubmit('parametersForm'));
          if (redirect) {
            redirect();
          }
        })
        .catch(error => {
          dispatch(
            stopSubmit('parametersForm', {
              _error: {
                title: formatMessage(messages.updateParametersFailed),
                message: error.message
              }
            })
          );
        });
    };
  }
};
