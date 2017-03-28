import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

import { getParameters } from './parameters';
import { getRegisteredNodes, getNodeCapabilities } from './nodes';
import { getRoles } from './roles';

export const getAvailableNodes = createSelector(
  getRegisteredNodes, (nodes) => nodes.filter(node => node.get('provision_state') === 'available')
);

export const getUntaggedAvailableNodes = createSelector(
  getAvailableNodes, (availableNodes) =>
    availableNodes.filterNot(node => getNodeCapabilities(node).profile)
);

/**
 *  Returns Nodes available for assignment for each Role (tagged to specific role
 *  + untagged nodes)
 *  TODO(jtomasek): remove this when NodesAssignment component is no longer used
 */
export const getAvailableNodesByRole = createSelector(
  [getAvailableNodes, getUntaggedAvailableNodes, getRoles], (nodes, untaggedNodes, roles) =>
    roles.map(role => nodes.filter(node => getNodeCapabilities(node).profile === role.identifier)
                           .merge(untaggedNodes))
);

/**
 *  Returns <RoleName>Count parameters for each Role
 */
export const getNodeCountParametersByRole = createSelector(
  [getRoles, getParameters], (roles, parameters) =>
    roles.map(role => parameters.get(`${role.name}Count`))
);

/**
 *  Returns <RoleName>Count parameters for each Role combined with values from
 *  nodesAssignment form
 */
export const getNodeCountParametersByRoleFromFormValues = createSelector(
  [getNodeCountParametersByRole, getFormValues('nodesAssignment')],
    (parametersByRole, formValues) =>
      parametersByRole.map(parameter =>
        parameter &&
          parameter.set('default', formValues && formValues[parameter.name]
            ? formValues[parameter.name]
            : parameter.default))
);

/**
 *  Returns sum of untagged assigned Nodes counts across all Roles
 */
export const getTotalUntaggedAssignedNodesCount = createSelector(
  [getAvailableNodes, getRoles, getNodeCountParametersByRoleFromFormValues],
  (nodes, roles, parametersByRole) =>
    roles.reduce((total, role) => {
      const taggedCount =
        nodes.filter(node => getNodeCapabilities(node).profile === role.identifier).size;
      const assignedCount = parametersByRole.getIn([role.identifier, 'default'], 0);
      const remainder = Math.max(0, assignedCount - taggedCount);
      return total + remainder;
    }, 0)
);

/**
 *  Returns maximum Nodes count available to assign by each Role
 */
export const getAvailableNodesCountsByRole = createSelector(
  [getAvailableNodes, getUntaggedAvailableNodes, getRoles,
   getNodeCountParametersByRoleFromFormValues, getTotalUntaggedAssignedNodesCount],
  (nodes, untaggedNodes, roles, parametersByRole, untaggedAssignedCount) =>
    roles.map(role => {
      const taggedCount
        = nodes.filter(node => getNodeCapabilities(node).profile === role.identifier).size;
      const assignedCount = parametersByRole.getIn([role.identifier, 'default'], 0);
      const untaggedCount = untaggedNodes.size;
      return taggedCount
        + Math.max(0, untaggedCount - untaggedAssignedCount
        + Math.max(0, assignedCount - taggedCount));
    })
);

/**
 *  Returns 'default' value of <RoleName>Count parameter for each Role
 *  { ControllerCount: 1, ComputeCount: 0, ... }
 */
export const getAssignedNodesCountsByRole = createSelector(
  getNodeCountParametersByRole, nodeCountParametersByRole =>
    nodeCountParametersByRole.mapEntries(([role, parameter]) =>
      parameter ? [parameter.name, parameter.default] : undefined)
);

export const getTotalAssignedNodesCount = createSelector(
  getNodeCountParametersByRole, countParamsByRole =>
    countParamsByRole.reduce((total, parameter) =>
      parameter ? total + parseInt(parameter.default) : total, 0)
);
