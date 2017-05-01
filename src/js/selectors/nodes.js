import { createSelector } from 'reselect';
import { List, Set } from 'immutable';

import { getFilterByName } from './filters';
import { getRoles } from './roles';
import { parseNodeCapabilities } from '../utils/nodes';

export const getNodes = state =>
  state.nodes.get('all').sortBy(n => n.get('uuid'));
export const getNodesByIds = (state, nodeIds) =>
  state.nodes
    .get('all')
    .filter((v, k) => nodeIds.includes(k))
    .sortBy(n => n.get('uuid'));
export const getPorts = state => state.nodes.get('ports');
export const nodesInProgress = state => state.nodes.get('nodesInProgress');
export const nodesToolbarFilter = state =>
  getFilterByName(state, 'nodesToolbar');

/**
 *  Return Nodes including mac addresses as string at macs attribute
 */
export const getNodesWithMacs = createSelector(
  [getNodes, getPorts],
  (nodes, ports) =>
    nodes.map(node =>
      node.set(
        'macs',
        ports
          .filter(p => node.get('uuid') === p.node_uuid)
          .reduce((str, v) => str + v.address, '')
      )
    )
);

export const getRegisteredNodes = createSelector(getNodesWithMacs, nodes =>
  nodes.filterNot(
    node => node.get('provision_state') === 'active' || node.get('maintenance')
  )
);

/**
 *  Return Registered Nodes with filters from nodesToolbar applied
 */
export const getFilteredRegisteredNodes = createSelector(
  [getRegisteredNodes, nodesToolbarFilter],
  (nodes, nodesToolbarFilter) =>
    nodes
      .update(nodes =>
        nodesToolbarFilter
          .get('activeFilters')
          .reduce(
            (filteredNodes, filter) =>
              filteredNodes.filter(node =>
                (node.get(filter.filterBy) || '')
                  .toLowerCase()
                  .includes(filter.filterString.toLowerCase())
              ),
            nodes
          )
      )
      .sortBy(node => node.getIn(nodesToolbarFilter.get('sortBy').split('.')))
      .update(
        nodes =>
          nodesToolbarFilter.get('sortDir') === 'desc' ? nodes.reverse() : nodes
      )
);

/**
 *  Return a list of profiles collected across all nodes
 */
export const getProfilesList = createSelector(getNodes, nodes =>
  nodes
    .reduce((profiles, v, k) => {
      const profile = getNodeCapabilities(v).profile;
      return profile ? profiles.push(profile) : profiles;
    }, List())
    .sort()
);

/**
 *  Return a list of profiles merged with role identifiers
 */
export const getAvailableNodeProfiles = createSelector(
  [getProfilesList, getRoles],
  (profiles, roles) => Set.fromKeys(roles).union(profiles).toList().sort()
);

export const getDeployedNodes = createSelector(getNodesWithMacs, nodes =>
  nodes.filter(node => node.get('provision_state') === 'active')
);

export const getMaintenanceNodes = createSelector(getNodesWithMacs, nodes =>
  nodes.filter(node => node.get('maintenance'))
);

/*
 * booleam, returns true if there are any nodes with operation in progress
 */
export const getNodesOperationInProgress = createSelector(
  nodesInProgress,
  nodesInProgress => !nodesInProgress.isEmpty()
);

/**
 * Helper function to get node capabilities object
 * @param node
 * @returns capabilities object
 */
export const getNodeCapabilities = node =>
  parseNodeCapabilities(node.getIn(['properties', 'capabilities'], ''));
