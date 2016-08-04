import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { Parameter } from '../immutableRecords/parameters';

const parameterTree = (state) => state.parameters.get('resourceTree');

export const getRootParameters = createSelector(
  [parameterTree], (parameterTree) => {
    return _convertToParameters(parameterTree.get('Parameters', Map())).sortBy(p => p.Name);
  }
);

export const getRolesResourceTree = createSelector(
  [parameterTree], (parameterTree) => {
    return (
      parameterTree
        .get('NestedParameters', Map())
        .filter(resource => resource.get('Type') === 'OS::Heat::ResourceGroup')
        .map((role, roleKey) => {
          const roleNestedStack = role.getIn(['NestedParameters', '0'], Map());
          return Map({
            description: roleNestedStack.get('Description'),
            parameters: _convertToParameters(roleNestedStack.get('Parameters', Map())),
            services: _getRoleServices(parameterTree, roleKey),
            networkConfiguration: _getRoleNetworkConfigParameters(roleNestedStack, roleKey)
          });
        })
    );
  }
);

export const getResourceTree = createSelector(
  [parameterTree, getRootParameters, getRolesResourceTree],
  (parameterTree, rootParameters, rolesResourceTree) => {
    return Map({
      rootParameters: rootParameters,
      roles: rolesResourceTree
    });
  }
);

/**
 * Brings up network configuration parameters for a specific role
 */
export const _getRoleNetworkConfigParameters = (roleNestedStack, roleKey) => {
  return roleNestedStack.get('NestedParameters', Map())
           .filter(resource =>
                   resource.get('Type') === `OS::TripleO::${roleKey}::Net::SoftwareConfig`)
           .map(resource => Map({
             description: resource.get('Description'),
             parameters: _convertToParameters(resource.get('Parameters', Map()))
           }));
};

/**
 * Brings parameters for services assigned to a role
 */
export const _getRoleServices = (heatParameters, roleKey) => {
  return heatParameters.get('NestedParameters', Map())
           // find resources named <RoleName>ServiceChain
           .find((resource, resourceKey) => resourceKey === `${roleKey}ServiceChain`, Map())
           // get Map of services (format is {0:service})
           .getIn(['NestedParameters', 'ServiceChain', 'NestedParameters'], Map())
           // convert the format of services to {Type:service}
           .mapEntries(([serviceKey, service]) => [service.get('Type'), service])
           // map the service to { name:..., description: ..., parameters: Map() }
           .map(service => Map({
             name: service.get('Type'),
             description: service.get('Description'),
             parameters: _convertToParameters(service.get('Parameters', Map()))
           }));
};

/**
 * Converts parameters to immutable Parameter Records
 */
export const _convertToParameters = parameters => {
  return parameters.map((parameter, key) => new Parameter(parameter).set('Name', key));
};
