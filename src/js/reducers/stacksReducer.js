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

  case StacksConstants.FETCH_RESOURCES_SUCCESS:
    if (state.stacks.get(action.payload.stackName)) {
      return state.setIn(
        ['stacks', action.payload.stackName, 'resources'],
        fromJS(action.payload.resources).map(resource => new StackResource(resource))
      );
    }
    return state;

  default:
    return state;

  }
}
