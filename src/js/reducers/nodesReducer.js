import { fromJS, Map } from 'immutable';

import NodesConstants from '../constants/NodesConstants';

const initialState = Map({
  isFetching: false,
  dataOperationInProgress: false,
  allFilter: '',
  registeredFilter: '',
  introspectedFilter: '',
  deployedFilter: '',
  maintenanceFilter: '',
  all: Map()
});

export default function nodesReducer(state = initialState, action) {
  switch(action.type) {

  case NodesConstants.REQUEST_NODES:
    return state.set('isFetching', true);

  case NodesConstants.RECEIVE_NODES:
    return state
            .set('all', fromJS(action.payload))
            .set('isFetching', false);

  case NodesConstants.START_NODES_OPERATION:
    return state.set('dataOperationInProgress', true);

  case NodesConstants.FINISH_NODES_OPERATION:
    return state.set('dataOperationInProgress', false);

  case NodesConstants.UPDATE_NODE_PENDING:
    return state.set('dataOperationInProgress', true);

  case NodesConstants.UPDATE_NODE_FAILED:
    return state.set('dataOperationInProgress', false);

  case NodesConstants.UPDATE_NODE_SUCCESS:
    return state.setIn(['all', action.payload.uuid], fromJS(action.payload))
                .set('dataOperationInProgress', false);

  default:
    return state;

  }
}
