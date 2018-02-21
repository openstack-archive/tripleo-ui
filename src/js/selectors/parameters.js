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

import { internalParameters } from '../constants/ParametersConstants';
import { getRole } from './roles';
import { getEnvironment } from './environmentConfiguration';
import { Resource } from '../immutableRecords/parameters';

const parameters = state => state.parameters.get('parameters');
const resources = state => state.parameters.get('resources');
const resourceById = (state, resourceId) =>
  state.parameters.resources.get(resourceId);

export const getParameters = createSelector([parameters], parameters =>
  parameters.sortBy(p => p.name.toLowerCase())
);

export const getResources = createSelector([resources], resources =>
  resources.sortBy(r => r.type)
);

/**
 * Returns parameters excluding internal parameters
 */
export const getParametersExclInternal = createSelector(
  [getParameters],
  parameters => parameters.filterNot(p => internalParameters.includes(p.name))
);

/**
 * Returns parameters defined in root template (overcloud.yaml)
 */
export const getRootParameters = createSelector(
  [getResources, getParameters],
  (resources, parameters) =>
    resources
      .find(resource => resource.name === 'Root', null, new Resource())
      .parameters.update(filterParameters(parameters))
);

export const getRoleResource = createSelector(
  [getResources, getRole],
  (resources, role) =>
    resources.find(
      resource => resource.type === `OS::TripleO::${role.name}`,
      null,
      new Resource()
    )
);

export const getRoleParameters = createSelector(
  [getResources, getParameters, getRoleResource],
  (resources, parameters, roleResource) =>
    roleResource.parameters.update(filterParameters(parameters))
);

/**
 * Returns map of Service resources for specific Role including map of parameters for each Service
 */
export const getRoleServices = createSelector(
  [getResources, getParametersExclInternal, getRole],
  (resources, parameters, role) =>
    resources
      // traverse the resources to find Role's ServiceChain resource
      .find(
        resource => resource.name === `${role.name}ServiceChain`,
        null,
        new Resource()
      )
      .get('resources', List())
      .map(r => resources.get(r))
      .find(r => r.name === 'ServiceChain', null, new Resource())
      // get ServiceChain resources
      .get('resources', List())
      // replace list of resource ids with Map of actual resources - Services
      .update(filterResources(resources))
      // for each Service, update it's parameters to include parameters of it's nested resources
      .map(r =>
        r
          .update(resource =>
            resource.set(
              'parameters',
              _extractParameters(
                resource.parameters,
                resource.resources,
                resources
              )
            )
          )
          .update('parameters', filterParameters(parameters))
      )
);

/**
 * Brings up network configuration resource for a specific role
 */
export const getRoleNetworkConfig = createSelector(
  [getResources, getParameters, getRoleResource, getRole],
  (resources, parameters, roleResource, role) =>
    roleResource.resources
      .map(r => resources.get(r))
      .find(
        resource =>
          resource.type === `OS::TripleO::${role.name}::Net::SoftwareConfig`,
        null,
        new Resource()
      )
      .update('parameters', filterParameters(parameters))
);

export const getEnvironmentParameters = createSelector(
  [getParametersExclInternal, getResources, getEnvironment],
  (parameters, resources, environment) =>
    resources
      // get list of resources from environment resource_registry
      .filter(r => environment.resourceRegistry.keySeq().includes(r.type))
      // collect parameter names from those resources
      .reduce(
        (result, resource) =>
          result.union(
            _extractParameters(
              resource.parameters,
              resource.resources,
              resources
            )
          ),
        Set()
      )
      // add parameters from environment's 'parameters' section to the list
      .union(environment.parameterDefaults.keySeq())
      .toMap()
      // convert list of parameter names to map of actual parameter records
      .update(filterParameters(parameters))
);

/**
 * Get Parameter list for resource by Id
 * (Can be used e.g. to fetch parameters for a service)
 */
export const getResourceParameters = createSelector(
  [getParameters, resourceById],
  (parameters, resource) =>
    resource.parameters.update(filterParameters(parameters))
);

/**
 * Helper function to convert list of resource uuids into map of actual resources
 * @param resources - Map of resources to filter on
 * @returns function
 */
const filterResources = resources => resourceUUIDs =>
  resources.filter((p, k) => resourceUUIDs.includes(k));

/**
 * Helper function to convert list of parameter names into map of actual parameters
 * @param parameters - Map of parameters to filter on
 * @returns function
 */
const filterParameters = parameters => parameterNames =>
  parameters.filter((p, k) => parameterNames.includes(k));

/**
 * Get Parameter list for resource by Id including parameters from all nested resources
 * (Can be used e.g. to fetch parameters for a service)
 */
export const getResourceParametersDeep = createSelector(
  [getResources, getParameters, resourceById],
  (resources, parameters, resource) =>
    _extractParameters(
      resource.parameters,
      resource.resources,
      resources
    ).update(filterParameters(parameters))
);

/**
 * Recursively extracts Parameter names from a Resource and it's nested Resources
 */
const _extractParameters = (parameters, nestedResources, allResources) =>
  nestedResources.reduce((pars, res) => {
    const resource = allResources.get(res);
    return _extractParameters(
      pars
        .toSet()
        .union(resource.parameters.toSet())
        .toList(),
      resource.resources,
      allResources
    );
  }, parameters);
