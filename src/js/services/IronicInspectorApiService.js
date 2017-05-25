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

import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getServiceUrl, getAuthTokenId } from './utils';

class IronicInspectorApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'ironic-inspector').then(serviceUrl => {
      let requestAttributes = _.merge(
        {
          url: `${serviceUrl}${path}`,
          headers: {
            'X-Auth-Token': getAuthTokenId()
          },
          crossOrigin: true,
          contentType: 'application/json',
          type: 'json',
          method: 'GET'
        },
        additionalAttributes
      );
      return when(request(requestAttributes));
    });
  }

  /**
   * Ironic Inspector API: GET /v1/introspection
   * @returns {object} introspection statuses
   */
  getIntrospectionStatuses() {
    return this.defaultRequest(`/introspection`);
  }

  /**
   * Ironic Inspector API: GET /v1/introspection/<Node ID>
   * @returns {object} introspection data
   */
  getIntrospectionData(nodeId) {
    return this.defaultRequest(`/introspection/${nodeId}/data`);
  }
}

export default new IronicInspectorApiService();
