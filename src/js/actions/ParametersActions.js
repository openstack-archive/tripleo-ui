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

import NotificationActions from '../actions/NotificationActions';
import ParametersConstants from '../constants/ParametersConstants';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logging/LoggingService';

const messages = defineMessages({
  parametersUpdatedNotficationTitle: {
    id: 'ParametersActions.parametersUpdatedNotficationTitle',
    defaultMessage: 'Parameters updated'
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
      MistralApiService.runAction(MistralConstants.PARAMETERS_GET, {
        container: planName
      })
        .then(response => {
          const { resources, parameters } = JSON.parse(
            response.output
          ).result.heat_resource_tree;
          const mistralParameters = JSON.parse(response.output).result
            .mistral_environment_parameters;
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
          logger.error(
            'Error in ParametersActions.fetchParameters',
            error.stack || error
          );
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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

  updateParametersSuccess(updatedParameters) {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_SUCCESS,
      payload: updatedParameters
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

  updateParameters(planName, data, inputFieldNames, redirect) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(startSubmit('nodesAssignment'));
      dispatch(this.updateParametersPending());
      MistralApiService.runAction(MistralConstants.PARAMETERS_UPDATE, {
        container: planName,
        parameters: data
      })
        .then(response => {
          dispatch(this.updateParametersSuccess(data));
          dispatch(stopSubmit('nodesAssignment'));
          dispatch(
            NotificationActions.notify({
              title: formatMessage(messages.parametersUpdatedNotficationTitle),
              message: formatMessage(
                messages.parametersUpdatedNotficationMessage
              ),
              type: 'success'
            })
          );
          if (redirect) {
            redirect();
          }
        })
        .catch(error => {
          logger.error('Error in ParametersActions.updateParameters', error);
          let errorHandler = new MistralApiErrorHandler(error, inputFieldNames);
          dispatch(stopSubmit('nodesAssignment', { _error: error }));
          dispatch(
            this.updateParametersFailed(
              errorHandler.errors,
              errorHandler.formFieldErrors
            )
          );
        });
    };
  }
};
