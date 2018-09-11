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
import { stackSchema } from '../normalizrSchemas/stacks';

export const fetchStacksPending = () => ({
  type: StacksConstants.FETCH_STACKS_PENDING
});

export const fetchStacksSuccess = data => ({
  type: StacksConstants.FETCH_STACKS_SUCCESS,
  payload: data
});

export const fetchStacksFailed = () => ({
  type: StacksConstants.FETCH_STACKS_FAILED
});

export const fetchStacks = planName => dispatch => {
  dispatch(fetchStacksPending());
  return dispatch(HeatApiService.getStacks())
    .then(response =>
      Promise.all(
        response.stacks.map(stack =>
          dispatch(HeatApiService.getStack(stack.stack_name, stack.id))
        )
      )
    )
    .then(responses => {
      const stacks =
        normalize(responses.map(r => r.stack), [stackSchema]).entities.stacks ||
        {};
      dispatch(fetchStacksSuccess(stacks));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Stacks could not be loaded'));
      dispatch(fetchStacksFailed());
    });
};

export const fetchResourcesPending = () => ({
  type: StacksConstants.FETCH_RESOURCES_PENDING
});

export const fetchResourcesSuccess = resources => ({
  type: StacksConstants.FETCH_RESOURCES_SUCCESS,
  payload: resources
});

export const fetchResourcesFailed = () => ({
  type: StacksConstants.FETCH_RESOURCES_FAILED
});

export const fetchResources = (stackName, stackId) => dispatch => {
  dispatch(fetchResourcesPending());
  dispatch(HeatApiService.getResources(stackName, stackId))
    .then(({ resources }) => dispatch(fetchResourcesSuccess(resources)))
    .catch(error => {
      dispatch(handleErrors(error, 'Stack Resources could not be loaded'));
      dispatch(fetchResourcesFailed());
    });
};

export const fetchResourceSuccess = resource => ({
  type: StacksConstants.FETCH_RESOURCE_SUCCESS,
  payload: resource
});

export const fetchResourceFailed = resourceName => ({
  type: StacksConstants.FETCH_RESOURCE_FAILED,
  payload: resourceName
});

export const fetchResourcePending = () => ({
  type: StacksConstants.FETCH_RESOURCE_PENDING
});

export const fetchResource = (stack, resourceName) => dispatch => {
  dispatch(fetchResourcePending());
  dispatch(HeatApiService.getResource(stack, resourceName))
    .then(({ resource }) => {
      dispatch(fetchResourceSuccess(resource));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Stack Resource could not be loaded'));
      dispatch(fetchResourceFailed(resourceName));
    });
};

export const fetchEnvironmentSuccess = (stack, environment) => ({
  type: StacksConstants.FETCH_STACK_ENVIRONMENT_SUCCESS,
  payload: { environment, stack }
});

export const fetchEnvironmentFailed = stack => ({
  type: StacksConstants.FETCH_STACK_ENVIRONMENT_FAILED,
  payload: { stack }
});

export const fetchEnvironmentPending = stack => ({
  type: StacksConstants.FETCH_STACK_ENVIRONMENT_PENDING,
  payload: { stack }
});

export const fetchEnvironment = stack => dispatch => {
  dispatch(fetchEnvironmentPending(stack));
  dispatch(HeatApiService.getEnvironment(stack))
    .then(response => {
      dispatch(fetchEnvironmentSuccess(stack, response));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Stack Environment could not be loaded'));
      dispatch(fetchEnvironmentFailed(stack));
    });
};
