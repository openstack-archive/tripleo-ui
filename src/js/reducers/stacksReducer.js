import { Map } from 'immutable';

import { Stack, StacksState } from '../immutableRecords/stacks';
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
            .set('stacks', Map(action.payload.reduce((obj, val) => {
              obj[val.stack_name] = Stack(val);
              return obj;
            }, {})));
  case StacksConstants.FETCH_STACKS_FAILED:
    return state
            .set('isLoaded', true)
            .set('isFetching', false)
            .set('stacks', Map());

  default:
    return state;

  }
}
