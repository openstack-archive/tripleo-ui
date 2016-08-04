import { fromJS, Map } from 'immutable';
import uuid from 'node-uuid';

import { Parameter } from '../immutableRecords/parameters';

/**
* Converts resource (NestedParameters or Parameters) Map to List, storing Map key as
* newProp and generates unique uuid which can be used for normalization
* @param {Immutable.Map} map - resource to perform operation on
* @param {string} newProp - new property on resource item where item key gets stored
*/
const _convertResourceMapToList = (map, newProp) => {
  return map.map((v, k) => v.set(newProp, k).set('uuid', uuid.v4())).toList();
};

/**
 * Traverses the nestedResources and converts Parameters and NestedParameters Maps into Lists
 * so it can be normalized
 * @param {Immutable.Map} nestedResources - Heat Validate response converted to Immutable tree
 * using Immutable.fromJS()
 */
export const processNestedParameters = nestedResources => {
  return nestedResources.map((item, key) => {
    if (key === 'Parameters') {
      return _convertResourceMapToList(item, 'name');
    } else if (key === 'NestedParameters') {
      return _convertResourceMapToList(item, 'name').map(item => processNestedParameters(item));
    } else {
      return item;
    }
  });
};

/**
 * Takes Heat validate reponse, converts it to Immutable Tree, sets it as rootResource and starts
 * processing
 * @param {object} heatResponseTree - Heat Validate response
 */
export const processTree = heatResponseTree => {
  return processNestedParameters(fromJS(heatResponseTree).set('name', 'root')
                                                         .set('uuid', uuid.v4()));
};





/**
 * Transforms Heat validate output into a sane parameters object
 */
export const parseParameters = heatResponse => {
  const heatParameters = fromJS(heatResponse);
  return Map({
    general: _convertToParameters(heatParameters.get('Parameters', Map())),
    roles: heatParameters.get('NestedParameters', Map())
             .filter(resource => resource.get('Type') === 'OS::Heat::ResourceGroup')
             .map((role, roleKey) => {
               const roleNestedStack = role.getIn(['NestedParameters', '0'], Map());
               return Map({
                 description: roleNestedStack.get('Description'),
                 parameters: _convertToParameters(roleNestedStack.get('Parameters', Map())),
                 services: _getRoleServices(heatParameters, roleKey),
                 networkConfiguration: _getRoleNetworkConfigParameters(roleNestedStack, roleKey)
               });
             })
  });
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
             parameters: _convertToParameters(service.get('Parameters', Map()))
           }));
};

/**
 * Converts parameters to immutable Parameter Records
 */
export const _convertToParameters = parameters => {
  return parameters.map(parameter => new Parameter(parameter));
};
