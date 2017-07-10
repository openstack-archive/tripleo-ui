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

import { fromJS, Map, Set } from 'immutable';

import NodesConstants from '../constants/NodesConstants';
import {
  NodesState,
  Port,
  IntrospectionStatus
} from '../immutableRecords/nodes';

const initialState = new NodesState();

export default function nodesReducer(state = initialState, action) {
  switch (action.type) {
    case NodesConstants.REQUEST_NODES:
      return state.set('isFetching', true);

    case NodesConstants.RECEIVE_NODES: {
      const { nodes, ports, introspectionStatuses } = action.payload;
      return state
        .set('all', fromJS(nodes || {}))
        .set('ports', Map(ports).map(port => new Port(port)))
        .set(
          'introspectionStatuses',
          Map(introspectionStatuses).map(s => new IntrospectionStatus(s))
        )
        .set('isLoaded', true)
        .set('isFetching', false);
    }

    case NodesConstants.FETCH_NODE_INTROSPECTION_DATA_SUCCESS: {
      const { nodeId, data } = action.payload;
      return state.setIn(['introspectionData', nodeId], fromJS(data));
    }

    case NodesConstants.FETCH_NODE_INTROSPECTION_DATA_FAILED:
      return state.deleteIn(['introspectionData', action.payload]);

    case NodesConstants.START_NODES_OPERATION:
      return state.update('nodesInProgress', nodesInProgress =>
        nodesInProgress.union(action.payload)
      );

    case NodesConstants.FINISH_NODES_OPERATION:
      return state.update('nodesInProgress', nodesInProgress =>
        nodesInProgress.subtract(action.payload)
      );

    case NodesConstants.ADD_NODES:
      return state.update('all', all => all.merge(fromJS(action.payload)));

    case NodesConstants.UPDATE_NODE_PENDING:
      return state.update('nodesInProgress', nodesInProgress =>
        nodesInProgress.add(action.payload)
      );

    case NodesConstants.UPDATE_NODE_FAILED:
      return state.update('nodesInProgress', nodesInProgress =>
        nodesInProgress.remove(action.payload)
      );

    case NodesConstants.UPDATE_NODE_SUCCESS:
      return state
        .updateIn(['all', action.payload.uuid], node =>
          node.merge(fromJS(action.payload))
        )
        .update('nodesInProgress', nodesInProgress =>
          nodesInProgress.remove(action.payload.uuid)
        );

    case NodesConstants.DELETE_NODE_SUCCESS:
      return state
        .deleteIn(['all', action.payload])
        .update('nodesInProgress', nodesInProgress =>
          nodesInProgress.remove(action.payload)
        );

    case NodesConstants.DELETE_NODE_FAILED:
      return state.update('nodesInProgress', nodesInProgress =>
        nodesInProgress.remove(action.payload)
      );

    case NodesConstants.REGISTER_MANAGE_AND_INTROSPECT_NODES:
      return state.set('manageAndIntrospectNodes', Set(action.payload));

    case NodesConstants.CLEAR_MANAGE_AND_INTROSPECT_NODES:
      const nodes = state.get('manageAndIntrospectNodes');
      return nodes
        .reduce((result, nodeUuid) => {
          return result.updateIn(['all', nodeUuid], node =>
            node.set('provision_state', 'manageable')
          );
        }, state)
        .set('manageAndIntrospectNodes', Set());

    default:
      return state;
  }
}
