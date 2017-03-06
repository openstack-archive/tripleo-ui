import { Map, List } from 'immutable';

import { ApiResponseError } from './errors';
import store from '../store';
import { ServiceUrlNotFoundError } from './errors';

/**
 * Returns the public url of an openstack API,
 * determined by the service's name.
 *
 * It gives precedence to urls stored in the app.conf file over
 * the ones exposed through the serviceCatalog.
 */
export function getServiceUrl(serviceName, urlType='publicURL', appConfig=getAppConfig()) {
  return new Promise((resolve, reject) => {
    let serviceUrl = appConfig[serviceName] || getFromServiceCatalog(serviceName, urlType);
    if(!serviceUrl) {
      reject(new ServiceUrlNotFoundError(`URL for service "${serviceName}" can not be found`));
    }
    resolve(serviceUrl.replace('%(tenant_id)s', getTenantId()));
  });
}

function getFromServiceCatalog(serviceName, urlType) {
  let endpoint = store.getState().login
    .getIn(['keystoneAccess', 'serviceCatalog'], List())
    .find(service => service.get('name') === serviceName, null, Map())
    .get('endpoints', List()).first();
  return endpoint ? endpoint.get(urlType) : undefined;
}

/**
 * Returns Keystone Auth Token ID
 */
export function getAuthTokenId() {
  return store.getState().login.getIn(['keystoneAccess', 'token', 'id']);
}

export function getTenantId() {
  return store.getState().login.getIn(['keystoneAccess', 'token', 'tenant', 'id']);
}

export function getAppConfig() {
  return window.tripleOUiConfig || {};
}

export const checkApiResponseStatus = ({ response, responseText }) => {
  if (!response.ok) { throw new ApiResponseError(response, responseText); }
  return JSON.parse(responseText);
};

export const getApiResponseText = response =>
  response.text().then(responseText => ({ response, responseText }));
