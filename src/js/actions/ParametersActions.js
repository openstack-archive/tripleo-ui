import { defineMessages } from 'react-intl';
import { normalize } from 'normalizr';
import { browserHistory } from 'react-router';
import uuid from 'node-uuid';
import * as _ from 'lodash';
import { startSubmit, stopSubmit } from 'redux-form';

import NotificationActions from '../actions/NotificationActions';
import ParametersConstants from '../constants/ParametersConstants';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logger';
import { resourceGroupSchema } from '../normalizrSchemas/parameters';

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

  fetchParameters(planName, parentPath) {
    return dispatch => {
      dispatch(this.fetchParametersPending());
      MistralApiService.runAction(MistralConstants.PARAMETERS_GET, { container: planName })
      .then(response => {
        const resourceTree = JSON.parse(response.output).result.heat_resource_tree;
        const mistralParameters = JSON.parse(response.output).result.mistral_environment_parameters;
        const { resources, parameters } = normalizeParameters(resourceTree);
        dispatch(this.fetchParametersSuccess({ resources, parameters, mistralParameters }));
      }).catch(error => {
        dispatch(this.fetchParametersFailed());
        if(parentPath) { browserHistory.push(parentPath); }
        logger.error('Error in ParametersActions.fetchParameters', error.stack || error);
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

  updateParameters(planName, data, inputFieldNames, url) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(startSubmit('nodesAssignment'));
      dispatch(this.updateParametersPending());
      MistralApiService.runAction(MistralConstants.PARAMETERS_UPDATE,
                                  { container: planName, parameters: data })
      .then(response => {
        dispatch(this.updateParametersSuccess(data));
        dispatch(stopSubmit('nodesAssignment'));
        dispatch(NotificationActions.notify({
          title: formatMessage(messages.parametersUpdatedNotficationTitle),
          message: formatMessage(messages.parametersUpdatedNotficationMessage),
          type: 'success'
        }));
        if (url) { browserHistory.push(url); }
      }).catch(error => {
        logger.error('Error in ParametersActions.updateParameters', error);
        let errorHandler = new MistralApiErrorHandler(error, inputFieldNames);
        dispatch(stopSubmit('nodesAssignment', { _error: error }));
        dispatch(this.updateParametersFailed(errorHandler.errors, errorHandler.formFieldErrors));
      });
    };
  }
};

export const normalizeParameters = resourceTree => {
  resourceTree.name = 'Root';
  return normalize(processResource(resourceTree), resourceGroupSchema).entities || {};
};

// Recursively convert NestedParameters and Parameters objects to Arrays
// so the data structure is easily consumable by normalizr
export const processResource = resource => {
  resource.id = uuid.v4();

  if (resource.NestedParameters) {
    resource.NestedParameters =
      // Convert NestedParameters (Resources) object to Array
      _.values(
        // Set NestedParameter (Resource) object key as NestedParameter name property
        _.mapValues(resource.NestedParameters, (value, key) => {
          value.name = key;
          // Recursively process nested Resources
          return processResource(value); })
      );
  }

  if (resource.Parameters) {
    resource.Parameters =
      // Convert Parameters object to Array
      _.values(
        // Set Parameter object key as Parameter name property
        _.mapValues(resource.Parameters, (value, key) => {
          value.name = key;
          // Convert Parameter properties to camelCase
          return _.mapKeys(value, (value, key) => _.camelCase(key)); })
      );
  }

  // Convert Resource properties to camelCase
  return _.mapKeys(resource, (value, key) => _.camelCase(key));
};
