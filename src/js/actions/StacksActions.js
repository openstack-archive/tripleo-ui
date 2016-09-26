import { normalize, arrayOf } from 'normalizr';

import HeatApiErrorHandler from '../services/HeatApiErrorHandler';
import HeatApiService from '../services/HeatApiService';
import NotificationActions from '../actions/NotificationActions';
import StacksConstants from '../constants/StacksConstants';
import { stackSchema, stackResourceSchema } from '../normalizrSchemas/stacks';
import logger from '../logger/logger';

export default {
  fetchStacksPending() {
    return {
      type: StacksConstants.FETCH_STACKS_PENDING
    };
  },

  fetchStacksSuccess(data) {
    return {
      type: StacksConstants.FETCH_STACKS_SUCCESS,
      payload: data
    };
  },

  fetchStacksFailed(error) {
    return {
      type: StacksConstants.FETCH_STACKS_FAILED
    };
  },

  fetchStacks(planName) {
    return dispatch => {
      dispatch(this.fetchStacksPending());
      HeatApiService.getStacks().then(response => {
        const stacks = normalize(response.stacks, arrayOf(stackSchema)).entities.stacks || {};
        dispatch(this.fetchStacksSuccess(stacks));
      }).catch(error => {
        logger.error('Error retrieving stacks StackActions.fetchStacks', error);
        let errorHandler = new HeatApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.fetchStacksFailed(error));
      });
    };
  },

  fetchResourcesPending() {
    return {
      type: StacksConstants.FETCH_RESOURCES_PENDING
    };
  },

  fetchResourcesFailed() {
    return {
      type: StacksConstants.FETCH_RESOURCES_FAILED
    };
  },

  fetchResourcesSuccess(stackName, resources) {
    return {
      type: StacksConstants.FETCH_RESOURCES_SUCCESS,
      payload: {
        stackName: stackName,
        resources: resources
      }
    };
  },

  fetchResources(stack) {
    return (dispatch) => {
      dispatch(this.fetchResourcesPending());
      HeatApiService.getResources(stack).then((response) => {
        dispatch(this.fetchResourcesSuccess(
          stack.stack_name,
          normalize(response.resources, arrayOf(stackResourceSchema)).entities.stackResources));
      }).catch((error) => {
        logger.error('Error retrieving resources StackActions.fetchResources', error);
        let errorHandler = new HeatApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.fetchResourcesFailed(error));
      });
    };
  },

  fetchResourceSuccess(stack, resourceName, resource) {
    return {
      type: StacksConstants.FETCH_RESOURCE_SUCCESS,
      payload: {
        stack,
        resourceName,
        resource
      }
    };
  },

  fetchResourceFailed(stack, resourceName) {
    return {
      type: StacksConstants.FETCH_RESOURCE_FAILED,
      payload: {
        stack,
        resourceName
      }
    };
  },

  fetchResourcePending(stack, resourceName) {
    return {
      type: StacksConstants.FETCH_RESOURCE_PENDING,
      payload: {
        stack,
        resourceName
      }
    };
  },

  fetchResource(stack, resourceName) {
    return (dispatch) => {
      dispatch(this.fetchResourcePending(stack));
      HeatApiService.getResource(stack, resourceName).then((response) => {
        dispatch(this.fetchResourceSuccess(stack, resourceName, response));
      }).catch((error) => {
        console.error('Error retrieving resource StackActions.fetchResource', error); //eslint-disable-line no-console
        let errorHandler = new HeatApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.fetchResourceFailed(error));
      });
    };
  },

  fetchEnvironmentSuccess(stack, environment) {
    return {
      type: StacksConstants.FETCH_ENVIRONMENT_SUCCESS,
      payload: {
        environment,
        stack
      }
    };
  },

  fetchEnvironmentFailed(stack) {
    return {
      type: StacksConstants.FETCH_ENVIRONMENT_FAILED,
      payload: {
        stack
      }
    };
  },

  fetchEnvironmentPending(stack) {
    return {
      type: StacksConstants.FETCH_ENVIRONMENT_PENDING,
      payload: {
        stack
      }
    };
  },

  fetchEnvironment(stack) {
    return (dispatch) => {
      dispatch(this.fetchEnvironmentPending(stack));
      HeatApiService.getEnvironment(stack).then((response) => {
        dispatch(this.fetchEnvironmentSuccess(stack, response));
      }).catch((error) => {
        console.error('Error retrieving environment StackActions.fetchEnvironment', error); //eslint-disable-line no-console
        let errorHandler = new HeatApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.fetchEnvironmentFailed(error));
      });
    };
  }

};
