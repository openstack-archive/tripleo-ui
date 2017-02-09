import { createSelector } from 'reselect';
import { List, Set } from 'immutable';

import { parseNodeCapabilities } from '../utils/nodes';
import { getRoles } from './roles';

export const getNodes = state => state.nodes.get('all').sortBy(n => n.get('uuid'));
export const getNodesByIds = (state, nodeIds) =>
  state.nodes.get('all').filter((v, k) => nodeIds.includes(k))
                        .sortBy(n => n.get('uuid'));
export const getPorts = state => state.nodes.get('ports');
export const nodesInProgress = state => state.nodes.get('nodesInProgress');

/**
 *  Return Nodes including mac addresses as string at macs attribute
 */
export const getNodesWithMacs = createSelector(
  [getNodes, getPorts], (nodes, ports) =>
    nodes
      .map(node => node
        .update('portsDetail', filterPorts(ports))
        .update(node => node
          .set('macs', node.get('portsDetail').reduce((str, v) => str + v.address, ''))))
);

export const getRegisteredNodes = createSelector(
  getNodesWithMacs, (nodes) => {
    return nodes.filterNot( node => node.get('provision_state') === 'active' ||
                                    node.get('maintenance') );
  }
);

/**
 *  Return a list of profiles collected across all nodes
 */
export const getProfilesList = createSelector(
  getNodes, nodes => nodes.reduce((profiles, v, k) => {
    const profile = parseNodeCapabilities(v.getIn(['properties', 'capabilities'])).profile;
    return profile ? profiles.push(profile) : profiles;
  }, List()).sort()
);

/**
 *  Return a list of profiles merged with role identifiers
 */
export const getAvailableNodeProfiles = createSelector(
  [getProfilesList, getRoles], (profiles, roles) =>
    Set.fromKeys(roles).union(profiles).toList().sort()
);

export const getAvailableNodes = createSelector(
  getNodesWithMacs, (nodes) => nodes.filter(node => node.get('provision_state') === 'available')
);

export const getDeployedNodes = createSelector(
  getNodesWithMacs, (nodes) => {
    return nodes.filter( node => node.get('provision_state') === 'active' );
  }
);

export const getMaintenanceNodes = createSelector(
  getNodesWithMacs, (nodes) => {
    return nodes.filter( node => node.get('maintenance') );
  }
);

export const getUnassignedAvailableNodes = createSelector(
  getAvailableNodes, (availableNodes) => {
    return availableNodes.filterNot(
      node => node.getIn(['properties', 'capabilities'], '').match(/.*profile:([\w\-]+)/)
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

export const getAssignedNodes = (availableNodes, roleIdentifier) => {
  return availableNodes.filter(
    node => node.getIn(['properties', 'capabilities'], '').includes(`profile:${roleIdentifier}`)
  );
};

/**
 * Helper function to convert list of port uuids into map of actual ports
 * @param ports - Map of ports to filter on
 * @returns function
 */
const filterPorts = (ports) =>
  portUUIDs => ports.filter((p, k) => portUUIDs.includes(k));
