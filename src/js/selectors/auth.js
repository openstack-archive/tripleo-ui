import { List, Map } from 'immutable';

import { getServiceUrlFromAppConfig } from './appConfig';

export const getAuthTokenId = state => state.login.tokenId;
export const getProjectId = state =>
  state.login.getIn(['token', 'project', 'id']);

export const getServiceUrlFromServiceCatalog = (
  state,
  serviceName,
  endpointType = 'public'
) =>
  state.login
    .getIn(['token', 'catalog'], List())
    .find(service => service.get('name') === serviceName, null, Map())
    .get('endpoints', List())
    .find(endpoint => endpoint.get('interface') === endpointType, null, Map())
    .get('url');

/**
 * Returns the public url of an openstack API,
 * determined by the service's name.
 *
 * It gives precedence to urls stored in the appConfig over
 * the ones exposed through the serviceCatalog.
 */
export const getServiceUrl = (state, service, endpointType = 'public') => {
  const serviceUrl =
    getServiceUrlFromAppConfig(state, service, endpointType) ||
    getServiceUrlFromServiceCatalog(state, service, endpointType) ||
    location.protocol + '//' + location.hostname;
  return serviceUrl.replace('%(project_id)s', getProjectId(state));
};
