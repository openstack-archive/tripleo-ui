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
