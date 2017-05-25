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

import { createSelector } from 'reselect';
import { List, Set } from 'immutable';

import { getFilterByName } from './filters';
import { getRoles } from './roles';
import { IntrospectionStatus } from '../immutableRecords/nodes';
import { parseNodeCapabilities } from '../utils/nodes';

export const getNodes = state =>
  state.nodes.get('all').sortBy(n => n.get('uuid'));
export const getNodesByIds = (state, nodeIds) =>
  state.nodes
    .get('all')
    .filter((v, k) => nodeIds.includes(k))
    .sortBy(n => n.get('uuid'));
export const getPorts = state => state.nodes.get('ports');
export const getIntrospectionStatuses = state =>
  state.nodes.get('introspectionStatuses');
export const nodesInProgress = state => state.nodes.get('nodesInProgress');
export const nodesToolbarFilter = state =>
  getFilterByName(state, 'nodesToolbar');

/**
 *  Return Nodes including mac addresses as string at macs attribute
 */
export const getDetailedNodes = createSelector(
  [getNodes, getPorts, getIntrospectionStatuses],
  (nodes, ports, introspectionStatuses) =>
    nodes.map(node =>
      node
        .set(
          'macs',
          ports
            .filter(p => node.get('uuid') === p.node_uuid)
            .map(port => port.address)
            .toList()
        )
        .set(
          'introspectionStatus',
          introspectionStatuses.get(node.get('uuid'), new IntrospectionStatus())
        )
    )
);

/**
 *  Return Nodes with filters from nodesToolbar applied
 */
export const getFilteredNodes = createSelector(
  [getDetailedNodes, nodesToolbarFilter],
  (nodes, nodesToolbarFilter) =>
    nodes
      .update(nodes =>
        nodesToolbarFilter.get('activeFilters').reduce(
          (filteredNodes, filter) =>
            filteredNodes.filter(node => {
              return getNodePropertyString(node, filter.filterBy)
                .toLowerCase()
                .includes(filter.filterString.toLowerCase());
            }),
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

/**
 * Helper function to get node property value
 * @param node
 * @param propName
 * @returns property value as string
 */
export const getNodePropertyString = (node, propName) => {
  switch (propName) {
    case 'macs':
      return node.get(propName).toString();
    case 'properties.capabilities.profile':
      return getNodeCapabilities(node).profile || '';
    default:
      return node.getIn(propName.split('.')) || '';
  }
};
