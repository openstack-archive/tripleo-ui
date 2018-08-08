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
import { getFormValues } from 'redux-form';

import { getCurrentPlanServerIds } from './stacks';
import { Flavor } from '../immutableRecords/flavors';
import { getNodes, getNodeCapabilities } from './nodes';
import { getParameters } from './parameters';
import { getRoles } from './roles';
import { getFlavors } from './flavors';
import { Parameter } from '../immutableRecords/parameters';

/**
 *  Return Nodes which are not deployed by any other plan
 */
export const getAccessibleNodes = createSelector(
  [getNodes, getCurrentPlanServerIds],
  (nodes, serverIds) =>
    nodes.filter(
      node =>
        !(node.get('provision_state') === 'active') ||
        serverIds.includes(node.get('instance_uuid'))
    )
);

/**
 *  Return Nodes which are either available or deployed (active) with current Plan
 */
export const getAvailableNodes = createSelector(
  [getAccessibleNodes, getCurrentPlanServerIds],
  (nodes, serverIds) =>
    nodes.filter(
      node =>
        ['available', 'active'].includes(node.get('provision_state')) &&
        !node.get('maintenance')
    )
);

export const getUntaggedAvailableNodes = createSelector(
  getAvailableNodes,
  availableNodes =>
    availableNodes.filterNot(node => getNodeCapabilities(node).profile)
);

/**
 *  Returns <RoleName>Count parameters for each Role
 */
export const getNodeCountParametersByRole = createSelector(
  [getRoles, getParameters],
  (roles, parameters) => roles.map(role => parameters.get(`${role.name}Count`))
);

/**
 *  Returns <RoleName>Count parameters for each Role combined with values from
 *  nodesAssignment form
 */
export const getNodeCountParametersByRoleFromFormValues = createSelector(
  [getNodeCountParametersByRole, getFormValues('nodesAssignment')],
  (parametersByRole, formValues) =>
    parametersByRole.map(
      parameter =>
        parameter &&
        parameter.set(
          'default',
          formValues && formValues[parameter.name] !== undefined
            ? formValues[parameter.name]
            : parameter.default
        )
    )
);

/**
 *  Returns Overcloud<RoleName>Flavor parameters for each Role
 */
export const getFlavorParametersByRole = createSelector(
  [getRoles, getParameters],
  (roles, parameters) =>
    roles.map(role =>
      parameters.get(`Overcloud${role.name}Flavor`, new Parameter())
    )
);

/**
 *  Returns flavor profile each Role.
 */
export const getFlavorProfilesByRole = createSelector(
  [getFlavorParametersByRole, getFlavors],
  (flavorParametersByRole, flavors) =>
    flavorParametersByRole.map(roleFlavorParameter =>
      flavors
        .find(
          flavor => flavor.name === roleFlavorParameter.default,
          null,
          new Flavor()
        )
        .getIn(['extra_specs', 'capabilities:profile'])
    )
);

/**
 *  Returns number of tagged nodes for each Role
 */
export const getTaggedNodesCountByRole = createSelector(
  [getAvailableNodes, getFlavorProfilesByRole],
  (nodes, flavorProfilesByRole) =>
    flavorProfilesByRole.map(
      (roleFlavorProfile, roleName) =>
        nodes.filter(node => {
          const nodeProfile = getNodeCapabilities(node).profile;
          return nodeProfile && nodeProfile === roleFlavorProfile;
        }).size
    )
);

/**
 *  Returns sum of untagged assigned Nodes counts across all Roles
 */
export const getTotalUntaggedAssignedNodesCount = createSelector(
  [
    getAvailableNodes,
    getRoles,
    getTaggedNodesCountByRole,
    getNodeCountParametersByRoleFromFormValues
  ],
  (nodes, roles, taggedNodesCountByRole, parametersByRole) =>
    roles.reduce((total, role) => {
      const taggedCount = taggedNodesCountByRole.get(role.name);
      const assignedCount = parametersByRole.getIn([role.name, 'default'], 0);
      const remainder = Math.max(0, assignedCount - taggedCount);
      return total + remainder;
    }, 0)
);

/**
 *  Returns maximum Nodes count available to assign by each Role
 */
export const getAvailableNodesCountsByRole = createSelector(
  [
    getAvailableNodes,
    getUntaggedAvailableNodes,
    getRoles,
    getTaggedNodesCountByRole,
    getNodeCountParametersByRoleFromFormValues,
    getTotalUntaggedAssignedNodesCount
  ],
  (
    nodes,
    untaggedNodes,
    roles,
    taggedNodesCountByRole,
    parametersByRole,
    untaggedAssignedCount
  ) =>
    roles.map(role => {
      const taggedCount = taggedNodesCountByRole.get(role.name);
      const assignedCount = parametersByRole.getIn([role.name, 'default'], 0);
      const untaggedCount = untaggedNodes.size;
      return (
        taggedCount +
        Math.max(
          0,
          untaggedCount -
            untaggedAssignedCount +
            Math.max(0, assignedCount - taggedCount)
        )
      );
    })
);

/**
 *  Returns 'default' value of <RoleName>Count parameter for each Role
 *  { ControllerCount: 1, ComputeCount: 0, ... }
 */
export const getAssignedNodesCountsByRole = createSelector(
  getNodeCountParametersByRole,
  nodeCountParametersByRole =>
    nodeCountParametersByRole.mapEntries(
      ([role, parameter]) =>
        parameter ? [parameter.name, parameter.default] : undefined
    )
);

export const getTotalAssignedNodesCount = createSelector(
  getNodeCountParametersByRoleFromFormValues,
  countParamsByRole =>
    countParamsByRole.reduce(
      (total, parameter) =>
        parameter ? total + parseInt(parameter.default) : total,
      0
    )
);
