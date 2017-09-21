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
