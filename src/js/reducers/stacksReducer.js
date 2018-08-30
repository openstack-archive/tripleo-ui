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

import { fromJS, Map, List } from 'immutable';

import { Stack, StackResource, StacksState } from '../immutableRecords/stacks';
import StacksConstants from '../constants/StacksConstants';

const initialState = new StacksState();

export default function stacksReducer(state = initialState, action) {
  switch (action.type) {
    case StacksConstants.FETCH_STACKS_PENDING:
      return state.set('isFetching', true);

    case StacksConstants.FETCH_STACKS_SUCCESS: {
      const stacks = fromJS(action.payload);
      return state
        .set('isLoaded', true)
        .set('isFetching', false)
        .set('stacks', stacks.map(stack => new Stack(stack)))
        .mergeIn(
          ['stacksOutputs'],
          stacks.map(stack => stack.get('outputs', List()))
        );
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
        .set('isFetchingEnvironment', false)
        .set('environmentLoaded', true);
    }

    case StacksConstants.FETCH_RESOURCE_SUCCESS:
      return state
        .set('resourcesLoaded', true)
        .setIn(
          ['resourceDetails', action.payload.resource_name],
          new StackResource(fromJS(action.payload))
        );

    default:
      return state;
  }
}
