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

import { normalize } from 'normalizr';

import { handleErrors } from './ErrorActions';
import HeatApiService from '../services/HeatApiService';
import StacksConstants from '../constants/StacksConstants';
import { stackSchema, stackResourceSchema } from '../normalizrSchemas/stacks';

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

  fetchStacksFailed() {
    return {
      type: StacksConstants.FETCH_STACKS_FAILED
    };
  },

  fetchStacks(planName) {
    return (dispatch, getState) => {
      dispatch(this.fetchStacksPending());
      return dispatch(HeatApiService.getStacks())
        .then(response => {
          const stacks =
            normalize(response.stacks, [stackSchema]).entities.stacks || {};
          dispatch(this.fetchStacksSuccess(stacks));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Stacks could not be loaded'));
          dispatch(this.fetchStacksFailed());
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
      dispatch(HeatApiService.getResources(stackName, stackId))
        .then(({ resources }) => {
          const res =
            normalize(resources, [stackResourceSchema]).entities
              .stackResources || {};
          dispatch(this.fetchResourcesSuccess(res));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Stack Resources could not be loaded'));
          dispatch(this.fetchResourcesFailed());
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
      dispatch(HeatApiService.getResource(stack, resourceName))
        .then(({ resource }) => {
          dispatch(this.fetchResourceSuccess(resource));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Stack Resource could not be loaded'));
          dispatch(this.fetchResourceFailed(resourceName));
        });
    };
  },

  fetchEnvironmentSuccess(stack, environment) {
    return {
      type: StacksConstants.FETCH_STACK_ENVIRONMENT_SUCCESS,
      payload: { environment, stack }
    };
  },

  fetchEnvironmentFailed(stack) {
    return {
      type: StacksConstants.FETCH_STACK_ENVIRONMENT_FAILED,
      payload: { stack }
    };
  },

  fetchEnvironmentPending(stack) {
    return {
      type: StacksConstants.FETCH_STACK_ENVIRONMENT_PENDING,
      payload: { stack }
    };
  },

  fetchEnvironment(stack) {
    return dispatch => {
      dispatch(this.fetchEnvironmentPending(stack));
      dispatch(HeatApiService.getEnvironment(stack))
        .then(response => {
          dispatch(this.fetchEnvironmentSuccess(stack, response));
        })
        .catch(error => {
          dispatch(
            handleErrors(error, 'Stack Environment could not be loaded')
          );
          dispatch(this.fetchEnvironmentFailed(stack));
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
      dispatch(HeatApiService.deleteStack(stack.stack_name, stack.id))
        .then(response => {
          dispatch(this.deleteStackSuccess(stack.stack_name));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Stack could not be deleted'));
          dispatch(this.deleteStackFailed());
        });
    };
  }
};
