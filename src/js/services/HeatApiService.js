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

import { getAuthTokenId, getServiceUrl } from '../services/utils';

class HeatApiService {
  request() {
    return request.apply(this, arguments);
  }

  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'heat').then(serviceUrl => {
      let requestAttributes = _.merge(
        {
          url: `${serviceUrl}${path}`,
          headers: { 'X-Auth-Token': getAuthTokenId() },
          crossOrigin: true,
          contentType: 'application/json',
          type: 'json',
          method: 'GET'
        },
        additionalAttributes
      );
      return when(this.request(requestAttributes));
    });
  }

  getStacks() {
    return this.defaultRequest('/stacks');
  }

  getStack(stackName, stackId) {
    return this.defaultRequest(`/stacks/${stackName}/${stackId}`);
  }

  getResources(stackName, stackId) {
    return this.defaultRequest(
      `/stacks/${stackName}/${stackId}/resources?nested_depth=3`
    );
  }

  getResource(stack, resourceName) {
    return this.defaultRequest(
      `/stacks/${stack.stack_name}/${stack.id}/resources/${resourceName}`
    );
  }

  getEnvironment(stack) {
    return this.defaultRequest(
      `/stacks/${stack.stack_name}/${stack.id}/environment`
    );
  }

  deleteStack(name, id) {
    return this.defaultRequest(`/stacks/${name}/${id}`, { method: 'DELETE' });
  }
}

export default new HeatApiService();
