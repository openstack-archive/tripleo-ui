/**
 * Copyright 2018 Red Hat Inc.
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

import { AuthenticationError, NovaApiError, ConnectionError } from './errors';
import { getAuthTokenId, getServiceUrl } from '../selectors/auth';

class NovaApiService {
  defaultRequest(path, additionalAttributes) {
    return (dispatch, getState) =>
      axios(
        Object.assign(
          {
            baseURL: getServiceUrl(getState(), 'nova'),
            url: path,
            method: 'GET',
            headers: {
              'X-Auth-Token': getAuthTokenId(getState())
            }
          },
          additionalAttributes
        )
      );
  }

  getFlavors() {
    return dispatch =>
      dispatch(this.defaultRequest('/flavors'))
        .then(response => response.data)
        .catch(handleErrors);
  }

  getFlavorExtraSpecs(flavorId) {
    return dispatch =>
      dispatch(this.defaultRequest(`/flavors/${flavorId}/os-extra_specs`))
        .then(response => {
          response.data.id = flavorId;
          return response.data;
        })
        .catch(handleErrors);
  }
}

const handleErrors = e => {
  if (e.response && e.response.status === 401) {
    return when.reject(new AuthenticationError(e));
  } else if (e.response) {
    return when.reject(new NovaApiError(e));
  } else if (e.request) {
    return when.reject(
      new ConnectionError('Connection to Nova API could not be established', e)
    );
  } else {
    return when.reject(e);
  }
};

export default new NovaApiService();
