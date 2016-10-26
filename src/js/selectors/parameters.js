import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { Parameter } from '../immutableRecords/parameters';
import { getRole } from './roles';

const parameterTree = (state) => state.parameters.get('resourceTree', Map());

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

// returns parameter tree for a specific role
export const getRoleResourceTree = createSelector(
  [getRolesResourceTree, getRole], (rolesResourceTree, role) => {
    if (role) {
      return rolesResourceTree.get(role.name, Map());
    }
    return Map();
  }
);

// returns a flat Map of all parameters
export const getResourceTreeParameters = createSelector(
  [parameterTree, getRootParameters], (parameterTree, rootParameters) => {
    const nestedResources = parameterTree.get('NestedParameters', Map());
    return _extractParameters(rootParameters, nestedResources);
  }
);

// Recursively extracts Parameters from Nested Resources
const _extractParameters = (allParameters, nestedResources) => {
  return nestedResources.reduce((parameters, resource) => {
    return _extractParameters(
             parameters.merge(_convertToParameters(resource.get('Parameters', Map()))),
             resource.get('NestedParameters', Map())
           );
  }, allParameters);
};

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
             parameters: _convertToParameters(
                           _extractParameters(
                             service.get('Parameters', Map()),
                             service.get('NestedParameters', Map())
                           )
                         )
           }));
};

/**
 * Converts parameters to immutable Parameter Records
 */
export const _convertToParameters = parameters => {
  return parameters.map((parameter, key) => new Parameter(parameter).set('Name', key));
};
