import { fromJS, List, Map, OrderedMap } from 'immutable';

import { NodeToRegister } from '../immutableRecords/nodes';
import RegisterNodesConstants from '../constants/RegisterNodesConstants';

const initialState = Map({
  isRegistering: false,
  nodesToRegister: OrderedMap(),
  registrationErrors: List(),
  selectedNodeId: undefined
});

export default function registerNodesReducer(state = initialState, action) {
  switch(action.type) {

  case RegisterNodesConstants.ADD_NODE: {
    const node = action.payload;
    return state.update('nodesToRegister', nodes => nodes.set(node.uuid, node));
  }

  case RegisterNodesConstants.SELECT_NODE: {
    return state.set('selectedNodeId', action.payload);
  }

  case RegisterNodesConstants.REMOVE_NODE: {
    const newState = state.update('nodesToRegister', nodes => nodes.delete(action.payload));
    if (action.payload === state.get('selectedNodeId')) {
      const nodeToSelect = newState.get('nodesToRegister').last();
      return newState.set('selectedNodeId', nodeToSelect ? nodeToSelect.uuid : undefined);
    } else {
      return newState;
    }
  }

  case RegisterNodesConstants.UPDATE_NODE: {
    return state.updateIn(['nodesToRegister', action.payload.uuid],
                          node => new NodeToRegister(fromJS(action.payload)));
  }

  case RegisterNodesConstants.START_NODES_REGISTRATION_PENDING: {
    return state.set('isRegistering', true);
  }

  case RegisterNodesConstants.START_NODES_REGISTRATION_FAILED: {
    return state.set('isRegistering', false)
                .set('registrationErrors', List(action.payload));
  }

  case RegisterNodesConstants.NODES_REGISTRATION_SUCCESS: {
    return initialState;
  }

  case RegisterNodesConstants.NODES_REGISTRATION_FAILED: {
    // TODO(jtomasek): repopulate nodesToRegister with action.payload.failedNodes
    return state.set('isRegistering', false)
                .set('registrationErrors', List(action.payload.errors));
  }

  case RegisterNodesConstants.CANCEL_NODES_REGISTRATION: {
    return initialState.set('isRegistering', state.get('isRegistering'));
  }

  default:
    return state;

  }
}
