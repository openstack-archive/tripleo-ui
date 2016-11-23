import { createSelector } from 'reselect';
import { List } from 'immutable';

import { internalParameters } from '../constants/ParametersConstants';
import { Resource } from '../immutableRecords/parameters';
import { getRole } from './roles';

const parameters = (state) => state.parameters.get('parameters').sortBy(p => p.name.toLowerCase());
const resources = (state) => state.parameters.get('resources');
const getResourceById = (state, resourceId) => state.parameters.resources.get(resourceId);

export const getParameters = createSelector(
  [parameters], parameters =>
    parameters.filterNot(p => internalParameters.includes(p.name))
);

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
    roleResource.parameters.map(p => parameters.get(p)).sortBy(p => p.label.toLowerCase())
);

export const getRoleServices = createSelector(
  [resources, parameters, getRole], (resources, parameters, role) =>
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
        .update('parameters', params => params.map(p => parameters.get(p))
                                              .sortBy(p => p.label.toLowerCase())))
      .sortBy(r => r.type)
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
      .update('parameters', params => params.map(p => parameters.get(p))
                                            .sortBy(p => p.label.toLowerCase()))
);

/**
 * Get Parameter list for resource by Id
 * (Can be used e.g. to fetch parameters for a service)
 */
export const getResourceParameters = createSelector(
  [parameters, getResourceById], (parameters, resource) =>
    resource.parameters.map(p => parameters.get(p)).sortBy(p => p.label.toLowerCase)
);

/**
 * Get Parameter list for resource by Id including parameters from all nested resources
 * (Can be used e.g. to fetch parameters for a service)
 */
export const getResourceParametersDeep = createSelector(
  [resources, parameters, getResourceById], (resources, parameters, resource) =>
    _extractParameters(resource.parameters, resource.nestedParameters, resources)
      .map(p => parameters.get(p))
      .sortBy(p => p.label.toLowerCase)
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
