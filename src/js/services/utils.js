import { Map, List } from 'immutable';
import store from '../store';
import { LANGUAGE_NAMES } from '../constants/i18n';

/**
 * Returns the public url of an openstack API,
 * determined by the service's name.
 *
 * It gives precedence to urls stored in the app.conf file over
 * the ones exposed through the serviceCatalog.
 */
export function getServiceUrl(
  serviceName,
  urlType = 'public',
  appConfig = getAppConfig()
) {
  let serviceUrl =
    appConfig[serviceName] || getFromServiceCatalog(serviceName, urlType);
  if (!serviceUrl) {
    throw Error(`URL for service ${serviceName} can not be found`);
  }
  return serviceUrl.replace('%(project_id)s', getProjectId());
}

function getFromServiceCatalog(serviceName, urlType) {
  return store
    .getState()
    .login.getIn(['token', 'catalog'], List())
    .find(service => service.get('name') === serviceName, null, Map())
    .get('endpoints', List())
    .find(endpoint => endpoint.get('interface') === urlType, null, Map())
    .get('url');
}

/**
 * Returns Keystone Auth Token ID
 */
export function getAuthTokenId() {
  return store.getState().login.getIn(['token', 'id']);
}

export function getProjectId() {
  return store.getState().login.getIn(['token', 'project', 'id']);
}

export function getAppConfig() {
  return window.tripleOUiConfig || {};
}

export function getEnabledLanguages() {
  const excludedLanguages = getAppConfig().excludedLanguages || [];
  let configLanguages = Object.assign({}, LANGUAGE_NAMES);
  excludedLanguages.map(language => {
    delete configLanguages[language];
  });

  return configLanguages;
}
