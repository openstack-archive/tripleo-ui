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

import { fromJS, Map } from 'immutable';

import { Stack, StackResource, StacksState } from '../immutableRecords/stacks';
import StacksConstants, { stackStates } from '../constants/StacksConstants';
import PlansConstants from '../constants/PlansConstants';

const initialState = new StacksState();

export default function stacksReducer(state = initialState, action) {
  switch (action.type) {
    case StacksConstants.FETCH_STACKS_PENDING:
      return state.set('isFetching', true);

    case StacksConstants.FETCH_STACKS_SUCCESS: {
      return state
        .set('isLoaded', true)
        .set('isFetching', false)
        .set('stacks', fromJS(action.payload).map(stack => new Stack(stack)));
    }

    case StacksConstants.FETCH_STACKS_FAILED:
      return state
        .set('isLoaded', true)
        .set('isFetching', false)
        .set('stacks', Map());

    case StacksConstants.FETCH_RESOURCES_PENDING:
      return state.set('isFetchingResources', true);

    case StacksConstants.FETCH_RESOURCES_SUCCESS: {
      return state
        .set('isFetchingResources', false)
        .set('resourcesLoaded', true)
        .set(
          'resources',
          fromJS(action.payload)
            .map(resource => new StackResource(resource))
            .sortBy(resource => resource.updated_time)
        );
    }

    case StacksConstants.FETCH_RESOURCES_FAILED:
      return state.set('isFetchingResources', false);

    case StacksConstants.FETCH_STACK_ENVIRONMENT_FAILED:
      return state.set('isFetchingEnvironment', false);

    case StacksConstants.FETCH_STACK_ENVIRONMENT_PENDING:
      return state.set('isFetchingEnvironment', true);

    case StacksConstants.FETCH_STACK_ENVIRONMENT_SUCCESS: {
      let environment = fromJS(action.payload.environment);
      return state
        .set('currentStackEnvironment', environment)
        .set('isFetchingEnvironment', false);
    }

    case StacksConstants.FETCH_RESOURCE_SUCCESS:
      return state
        .set('resourcesLoaded', true)
        .setIn(
          ['resourceDetails', action.payload.resource_name],
          new StackResource(fromJS(action.payload))
        );

    case PlansConstants.PLAN_CHOSEN:
      return initialState;

    case StacksConstants.DELETE_STACK_SUCCESS:
      return state
        .set('isRequestingStackDelete', false)
        .setIn(
          ['stacks', action.payload, 'stack_status'],
          stackStates.DELETE_IN_PROGRESS
        );

    case StacksConstants.DELETE_STACK_FAILED:
      return state.set('isRequestingStackDelete', false);

    case StacksConstants.DELETE_STACK_PENDING:
      return state.set('isRequestingStackDelete', true);

    default:
      return state;
  }
}
