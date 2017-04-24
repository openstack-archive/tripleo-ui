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

import { normalize, arrayOf } from 'normalizr';

import HeatApiErrorHandler from '../services/HeatApiErrorHandler';
import HeatApiService from '../services/HeatApiService';
import NotificationActions from '../actions/NotificationActions';
import StacksConstants from '../constants/StacksConstants';
import { stackSchema, stackResourceSchema } from '../normalizrSchemas/stacks';
import logger from '../services/logging/LoggingService';

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
    return (dispatch, getState) => {
      dispatch(this.fetchStacksPending());
      HeatApiService.getStacks()
        .then(response => {
          const stacks = normalize(response.stacks, arrayOf(stackSchema))
            .entities.stacks || {};
          dispatch(this.fetchStacksSuccess(stacks));
        })
        .catch(error => {
          logger.error(
            'Error retrieving stacks StackActions.fetchStacks',
            error
          );
          let errorHandler = new HeatApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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

  fetchResourcesSuccess(resources) {
    return {
      type: StacksConstants.FETCH_RESOURCES_SUCCESS,
      payload: resources
    };
  },

  fetchResourcesFailed() {
    return {
      type: StacksConstants.FETCH_RESOURCES_FAILED
    };
  },

  fetchResources(stackName, stackId) {
    return dispatch => {
      dispatch(this.fetchResourcesPending());
      HeatApiService.getResources(stackName, stackId)
        .then(({ resources }) => {
          const res = normalize(resources, arrayOf(stackResourceSchema))
            .entities.stackResources || {};
          dispatch(this.fetchResourcesSuccess(res));
        })
        .catch(error => {
          logger.error(
            'Error retrieving resources StackActions.fetchResources',
            error
          );
          let errorHandler = new HeatApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.fetchResourcesFailed(error));
        });
    };
  },

  fetchResourceSuccess(resource) {
    return {
      type: StacksConstants.FETCH_RESOURCE_SUCCESS,
      payload: resource
    };
  },

  fetchResourceFailed(resourceName) {
    return {
      type: StacksConstants.FETCH_RESOURCE_FAILED,
      payload: resourceName
    };
  },

  fetchResourcePending() {
    return {
      type: StacksConstants.FETCH_RESOURCE_PENDING
    };
  },

  fetchResource(stack, resourceName) {
    return dispatch => {
      dispatch(this.fetchResourcePending());
      HeatApiService.getResource(stack, resourceName)
        .then(({ resource }) => {
          dispatch(this.fetchResourceSuccess(resource));
        })
        .catch(error => {
          logger.error(
            'Error retrieving resource StackActions.fetchResource',
            error
          );
          let errorHandler = new HeatApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.fetchResourceFailed(resourceName));
        });
    };
  },

  fetchEnvironmentSuccess(stack, environment) {
    return {
      type: StacksConstants.FETCH_STACK_ENVIRONMENT_SUCCESS,
      payload: {
        environment,
        stack
      }
    };
  },

  fetchEnvironmentFailed(stack) {
    return {
      type: StacksConstants.FETCH_STACK_ENVIRONMENT_FAILED,
      payload: {
        stack
      }
    };
  },

  fetchEnvironmentPending(stack) {
    return {
      type: StacksConstants.FETCH_STACK_ENVIRONMENT_PENDING,
      payload: {
        stack
      }
    };
  },

  fetchEnvironment(stack) {
    return dispatch => {
      dispatch(this.fetchEnvironmentPending(stack));
      HeatApiService.getEnvironment(stack)
        .then(response => {
          dispatch(this.fetchEnvironmentSuccess(stack, response));
        })
        .catch(error => {
          logger.error(
            'Error retrieving environment StackActions.fetchEnvironment',
            error
          );
          let errorHandler = new HeatApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.fetchEnvironmentFailed(error));
        });
    };
  },

  deleteStackSuccess(stackName) {
    return {
      type: StacksConstants.DELETE_STACK_SUCCESS,
      payload: stackName
    };
  },

  deleteStackFailed() {
    return {
      type: StacksConstants.DELETE_STACK_FAILED
    };
  },

  deleteStackPending() {
    return {
      type: StacksConstants.DELETE_STACK_PENDING
    };
  },

  /**
   * Starts a delete request for a stack.
   */
  deleteStack(stack) {
    return dispatch => {
      dispatch(this.deleteStackPending());
      HeatApiService.deleteStack(stack.stack_name, stack.id)
        .then(response => {
          dispatch(this.deleteStackSuccess(stack.stack_name));
        })
        .catch(error => {
          logger.error('Error deleting stack StackActions.deleteStack', error);
          let errorHandler = new HeatApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.deleteStackFailed());
        });
    };
  }
};
