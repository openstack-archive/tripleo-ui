import { createSelector } from 'reselect';

const nodes = state => state.nodes.get('all');
const nodesInProgress = state => state.nodes.get('nodesInProgress');

export const getRegisteredNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filterNot( node => node.get('provision_state') === 'active' ||
                                    node.get('maintenance') );
  }
);

export const getAvailableNodes = createSelector(
  nodes, (nodes) => nodes.filter(node => node.get('provision_state') === 'available')
);

export const getDeployedNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.get('provision_state') === 'active' );
  }
);

export const getMaintenanceNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.get('maintenance') );
  }
);

export const getUnassignedAvailableNodes = createSelector(
  getAvailableNodes, (availableNodes) => {
    return availableNodes.filterNot(
      node => node.getIn(['properties', 'capabilities'], '').match(/.*profile:(\w+)/)
    );
  }
);

/*
 * booleam, returns true if there are any nodes with operation in progress
 */
export const getNodesOperationInProgress = createSelector(
  nodesInProgress, (nodesInProgress) => {
    return !nodesInProgress.isEmpty();
  }
);

export const getAssignedNodes = (availableNodes, roleName) => {
  return availableNodes.filter(
    node => node.getIn(['properties', 'capabilities'], '').includes(`profile:${roleName}`)
  );
};
