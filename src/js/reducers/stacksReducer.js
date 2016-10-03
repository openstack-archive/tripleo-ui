import { fromJS, Map } from 'immutable';

import { Stack, StackResource, StacksState } from '../immutableRecords/stacks';
import StacksConstants from '../constants/StacksConstants';

const initialState = new StacksState;

export default function stacksReducer(state = initialState, action) {
  switch(action.type) {

  case StacksConstants.FETCH_STACKS_PENDING:
    return state.set('isFetching', true);

  case StacksConstants.FETCH_STACKS_SUCCESS:
    return state
            .set('isLoaded', true)
            .set('isFetching', false)
            .set('stacks', fromJS(action.payload).map(stack => new Stack(stack)));

  case StacksConstants.FETCH_STACKS_FAILED:
    return state
            .set('isLoaded', true)
            .set('isFetching', false)
            .set('stacks', Map());

  case StacksConstants.FETCH_STACK_PENDING:
    return state.set('isFetching', true);

  case StacksConstants.FETCH_STACK_SUCCESS: {
    const stack = new Stack(fromJS(action.payload))
                    .update('resources', resources => resources
                      .map(resource => new StackResource(resource)));
    return state.set('isFetching', false)
                .mergeDeepIn(['stacks', action.payload.stack_name], stack);
  }

  case StacksConstants.FETCH_STACK_FAILED:
    return state.set('isFetching', false);

  case StacksConstants.FETCH_ENVIRONMENT_SUCCESS:
    return state.setIn(
      ['stacks', action.payload.stack.stack_name, 'environment'],
      fromJS(action.payload.environment));

  case StacksConstants.FETCH_RESOURCE_SUCCESS:
    if (state.stacks.get(action.payload.stack.stack_name)) {
      return state.setIn(
        ['stacks', action.payload.stack.stack_name, 'resources', action.payload.resourceName],
        new StackResource(fromJS(action.payload.resource.resource))
      );
    }
    return state;

  default:
    return state;

  }
}
