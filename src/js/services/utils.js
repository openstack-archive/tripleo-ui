import store from '../store';

/**
 * Returns the public url of an openstack API,
 * determined by the service's name.
 */
export function getServiceUrl(serviceName) {
  return store.getState().login.getIn(['keystoneAccess','serviceCatalog'])
                               .find(service => service.get('name') === serviceName)
                               .get('endpoints').first().get('adminURL');
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
