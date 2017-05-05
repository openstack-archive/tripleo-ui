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
import logger from '../services/logger';

class SwiftApiService {

  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'swift').then((serviceUrl) => {
      let requestAttributes = _.merge({
        url: `${serviceUrl}${path}`,
        crossOrigin: true,
        method: 'GET',
        headers: {
          'X-Auth-Token': getAuthTokenId()
        }
      }, additionalAttributes);
      return when(request(requestAttributes));
    });
  }

  createObject(container, objectName, data) {
    return this.defaultRequest(`/${container}/${objectName}`, {
      method: 'PUT',
      data: data
    });
  }

  getContainer(container) {
    return this.defaultRequest(`/${container}?format=json`, {
      method: 'GET'
    });
  }

  getObject(container, object) {
    return this.defaultRequest(`/${container}/${object}?format=json`, {
      method: 'GET'
    });
  }

  uploadTarball(planName, file) {
    return this.defaultRequest(`/${planName}?extract-archive=tar.gz`, {
      method: 'PUT',
      contentType: 'application/x-www-form-urlencoded',
      processData: false,
      data: file
    }).then((response) => {
      return when.resolve(response);
    }).catch((xhr) => {
      // Swift doesn't add CORS headers to sucessful PUT requests,
      // so a failed request is counted as success if *all* of the
      // following criteria a true:
      //   - status is 0
      //   - statusText is empty
      //   - timeout is false
      if(xhr.status === 0 && xhr.statusText === '' && xhr.timeout === 0) {
        return when.resolve(xhr);
      }
      logger.error('Tarball upload failed', xhr);
      return when.reject(xhr);
    });
  }
}

export default new SwiftApiService();
