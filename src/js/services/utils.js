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

  return Map(configLanguages).sort();
}
