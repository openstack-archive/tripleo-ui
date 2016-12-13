import { createSelector } from 'reselect';
import { List, Set } from 'immutable';

import { internalParameters } from '../constants/ParametersConstants';
import { Resource } from '../immutableRecords/parameters';
import { getRole } from './roles';
import { getEnvironment } from './environmentConfiguration';

const parameters = (state) => state.parameters.get('parameters').sortBy(p => p.name.toLowerCase());
const resources = (state) => state.parameters.get('resources').sortBy(r => r.type);
const getResourceById = (state, resourceId) => state.parameters.resources.get(resourceId);

/**
 * Returns parameters excluding internal parameters
 */
export const getParametersExclInternal = createSelector(
  [parameters], parameters =>
    parameters.filterNot(p => internalParameters.includes(p.name))
);

/**
 * Returns parameters defined in root template (overcloud.yaml)
 */
export const getRootParameters = createSelector(
  [resources, parameters], (resources, parameters) =>
    resources
      .find(resource => resource.name === 'Root', null, new Resource())
      .parameters.update(params => parameters.filter((p, k) => params.includes(k)))
);

export const getRoleResource = createSelector(
  [resources, getRole], (resources, role) =>
    resources.find(resource => resource.type === `OS::TripleO::${role.name}`, null, new Resource())
);

export const getRoleParameters = createSelector(
  [resources, parameters, getRoleResource], (resources, parameters, roleResource) =>
    roleResource.parameters.update(params => parameters.filter((p, k) => params.includes(k)))
);

/**
 * Returns map of Service resources for specific Role including map of parameters for each Service
 */
export const getRoleServices = createSelector(
  [resources, getParametersExclInternal, getRole], (resources, parameters, role) =>
    resources
      .find(resource => resource.name === `${role.name}ServiceChain`, null, new Resource())
      .get('nestedParameters', List())
      .map(r => resources.get(r))
      .find(r => r.name === 'ServiceChain', null, new Resource())
      .get('nestedParameters', List())
      .update(nestedParameters => resources.filter((r, k) => nestedParameters.includes(k)))
      .map(r => r
        .update(resource => resource
          .set('parameters',
               _extractParameters(resource.parameters, resource.nestedParameters, resources)))
        .update('parameters', params => parameters.filter((p, k) => params.includes(k))))
);

/**
 * Brings up network configuration resource for a specific role
 */
export const getRoleNetworkConfig = createSelector(
  [resources, parameters, getRoleResource, getRole],
  (resources, parameters, roleResource, role) =>
    roleResource.nestedParameters
      .map(r => resources.get(r))
      .find(resource => resource.type === `OS::TripleO::${role.name}::Net::SoftwareConfig`,
            null,
            new Resource())
      .update('parameters', params => parameters.filter((p, k) => params.includes(k)))
);


export const getEnvironmentParameters = createSelector(
  [getParametersExclInternal, resources, getEnvironment], (parameters, resources, environment) => {
    return resources
        // get list of resources from environment resource_registry
        .filter(r => environment.resourceRegistry.keySeq().includes(r.type))
        // collect parameter names from those resources
        .reduce((result, resource) => result.union(resource.parameters), Set())
        .toMap()
        // convert list of parameter names to map of actual parameter records
        .update(params => parameters.filter((p, k) => params.includes(k)));
  }
);

/**
 * Get Parameter list for resource by Id
 * (Can be used e.g. to fetch parameters for a service)
 */
export const getResourceParameters = createSelector(
  [parameters, getResourceById], (parameters, resource) =>
    resource.parameters.update(params => parameters.filter((p, k) => params.includes(k)))
);

/**
 * Get Parameter list for resource by Id including parameters from all nested resources
 * (Can be used e.g. to fetch parameters for a service)
 */
export const getResourceParametersDeep = createSelector(
  [resources, parameters, getResourceById], (resources, parameters, resource) =>
    _extractParameters(resource.parameters, resource.nestedParameters, resources)
      .update(params => parameters.filter((p, k) => params.includes(k)))
);

/**
 * Recursively extracts Parameter names from a Resource and it's nested Resources
 */
const _extractParameters = (parameters, nestedResources, allResources) => {
  return nestedResources.reduce((pars, res) => {
    const resource = allResources.get(res);
    return _extractParameters(pars.toSet().union(resource.parameters.toSet()).toList(),
                              resource.nestedParameters,
                              allResources);
  }, parameters);
};
