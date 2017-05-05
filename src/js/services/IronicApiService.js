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

class IronicApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'ironic').then(serviceUrl => {
      let requestAttributes = _.merge(
        {
          url: `${serviceUrl}${path}`,
          headers: {
            'X-Auth-Token': getAuthTokenId(),
            'X-OpenStack-Ironic-API-Version': '1.14'
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
   * Ironic API: GET /v1/nodes/detail
   * @returns {array} of nodes with complete details
   */
  getNodes() {
    return this.defaultRequest('/nodes/detail');
  }

  /**
   * Ironic API: GET /v1/nodes/<uuid>
   * @returns node object.
   */
  getNode(nodeId) {
    return this.defaultRequest('/nodes/' + nodeId);
  }

  getPorts() {
    return this.defaultRequest('/ports/detail');
  }

  patchNode(nodePatch) {
    return this.defaultRequest('/nodes/' + nodePatch.uuid, {
      method: 'PATCH',
      data: JSON.stringify(nodePatch.patches)
    });
  }

  deleteNode(nodeId) {
    return this.defaultRequest('/nodes/' + nodeId, {
      method: 'DELETE'
    });
  }
}

export default new IronicApiService();
