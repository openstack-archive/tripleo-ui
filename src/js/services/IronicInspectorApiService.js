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

import axios from 'axios';
import when from 'when';

import {
  AuthenticationError,
  IronicInspectorApiError,
  ConnectionError
} from './errors';
import { getServiceUrl, getAuthTokenId } from './utils';

class IronicInspectorApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'ironic-inspector').then(serviceUrl => {
      let requestAttributes = Object.assign(
        {
          baseURL: `${serviceUrl}/v1`,
          url: path,
          method: 'GET',
          headers: {
            'X-Auth-Token': getAuthTokenId()
          }
        },
        additionalAttributes
      );
      return axios(requestAttributes);
    });
  }

  /**
   * Ironic Inspector API: GET /v1/introspection
   * @returns {object} introspection statuses
   */
  getIntrospectionStatuses() {
    return this.defaultRequest(`/introspection`)
      .then(response => response.data)
      .catch(error => handleErrors(error));
  }

  /**
   * Ironic Inspector API: GET /v1/introspection/<Node ID>
   * @returns {object} introspection data
   */
  getIntrospectionData(nodeId) {
    return this.defaultRequest(`/introspection/${nodeId}/data`)
      .then(response => response.data)
      .catch(error => handleErrors(error));
  }
}

const handleErrors = e => {
  if (e.response && e.response.status === 401) {
    return when.reject(new AuthenticationError(e));
  } else if (e.response) {
    return when.reject(new IronicInspectorApiError(e));
  } else if (e.request) {
    return when.reject(
      new ConnectionError(
        'Connection to Ironic Inspector API could not be established',
        e
      )
    );
  } else {
    return when.reject(e);
  }
};

export default new IronicInspectorApiService();
