import { fromJS, Map, Set } from 'immutable';

import NodesConstants from '../constants/NodesConstants';
import { Port } from '../immutableRecords/nodes';

const initialState = Map({
  isFetching: false,
  isLoaded: false,
  nodesInProgress: Set(),
  all: Map(),
  ports: Map()
});

export default function nodesReducer(state = initialState, action) {
  switch (action.type) {
    case NodesConstants.REQUEST_NODES:
      return state.set('isFetching', true);

    case NodesConstants.RECEIVE_NODES: {
      const { nodes, ports } = action.payload;
      return state
        .set('all', fromJS(nodes || {}))
        .set('ports', Map(ports).map(port => new Port(port)))
        .set('isFetching', false)
        .set('isLoaded', true);
    }

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

    default:
      return state;
  }
}
