import store from '../store';

/**
 * Returns the public url of an openstack API,
 * determined by the service's name.
 *
 * It gives precedence to urls stored in the app.conf file over
 * the ones exposed through the serviceCatalog.
 */
export function getServiceUrl(serviceName, urlType='publicURL', appConfig=getAppConfig()) {
  return appConfig[serviceName] || store.getState().login
    .getIn(['keystoneAccess', 'serviceCatalog'])
    .find(service => service.get('name') === serviceName)
    .get('endpoints').first().get(urlType);
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
