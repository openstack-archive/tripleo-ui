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

import { AuthenticationError, SwiftApiError, ConnectionError } from './errors';
import { getAuthTokenId, getServiceUrl } from '../services/utils';

class SwiftApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'swift').then(serviceUrl => {
      let requestAttributes = Object.assign(
        {
          baseURL: serviceUrl,
          url: path,
          method: 'GET',
          headers: { 'X-Auth-Token': getAuthTokenId() }
        },
        additionalAttributes
      );
      return axios(requestAttributes);
    });
  }

  createObject(container, objectName, data) {
    return this.defaultRequest(`/${container}/${objectName}`, {
      method: 'PUT',
      data: data
    }).catch(error => handleErrors(error));
  }

  getContainer(container) {
    return this.defaultRequest(`/${container}`, {
      method: 'GET',
      params: { format: 'json' }
    })
      .then(response => response.data)
      .catch(error => handleErrors(error));
  }

  getObject(container, object) {
    return this.defaultRequest(`/${container}/${object}`, {
      method: 'GET',
      params: { format: 'json' }
    })
      .then(response => response.data)
      .catch(error => handleErrors(error));
  }

  uploadTarball(planName, file) {
    return this.defaultRequest(`/${planName}`, {
      method: 'PUT',
      data: file,
      params: { 'extract-archive': 'tar.gz' }
    })
      .then(response => response.data)
      .catch(error => {
        // Swift doesn't add CORS headers to sucessful PUT requests,
        // so a failed request is counted as success if *all* of the
        // following criteria a true:
        //   - status is 0
        //   - statusText is empty
        //   - timeout is false
        if (
          error.request.status === 0 &&
          error.request.statusText === '' &&
          error.request.timeout === 0
        ) {
          return when.resolve(error.data);
        } else {
          return handleErrors(error);
        }
      });
  }
}

const handleErrors = e => {
  if (e.response) {
    switch (e.response.status) {
      case 401:
        return when.reject(new AuthenticationError(e));
      default:
        return when.reject(
          new SwiftApiError(
            `Swift API Error: ${e.response.status} - ${e.response.data}`,
            e
          )
        );
    }
  } else if (e.request) {
    return when.reject(
      new ConnectionError('Connection to Swift API could not be established', e)
    );
  } else {
    return when.reject(e);
  }
};

export default new SwiftApiService();
