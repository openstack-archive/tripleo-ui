import { Map, List } from 'immutable';
import store from '../store';

/**
 * Returns the public url of an openstack API,
 * determined by the service's name.
 *
 * It gives precedence to urls stored in the app.conf file over
 * the ones exposed through the serviceCatalog.
 */
export function getServiceUrl(serviceName, urlType='publicURL', appConfig=getAppConfig()) {
  let serviceUrl = appConfig[serviceName] || getFromServiceCatalog(serviceName, urlType);
  if(!serviceUrl) {
    throw Error(`URL for service ${serviceName} can not be found`);
  }
  return serviceUrl;
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
