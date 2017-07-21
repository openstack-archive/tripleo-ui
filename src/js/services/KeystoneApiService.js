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
  KeystoneApiError,
  ConnectionError
} from './errors';
import { KEYSTONE_URL } from '../constants/KeystoneApiConstants';

class KeystoneApiService {
  defaultRequest(additionalAttributes) {
    return axios(
      Object.assign(
        {
          baseURL: KEYSTONE_URL,
          url: '/auth/tokens',
          method: 'POST'
        },
        additionalAttributes
      )
    );
  }

  authenticateUser(username, password) {
    return this.defaultRequest({
      data: {
        auth: {
          identity: {
            methods: ['password'],
            password: {
              user: {
                name: username,
                domain: {
                  name: 'Default'
                },
                password: password
              }
            }
          },
          scope: {
            project: {
              name: 'admin',
              domain: {
                name: 'Default'
              }
            }
          }
        }
      }
    }).catch(error => handleErrors(error));
  }

  authenticateUserViaToken(keystoneAuthTokenId) {
    return this.defaultRequest({
      data: {
        auth: {
          identity: {
            methods: ['token'],
            token: {
              id: keystoneAuthTokenId
            }
          },
          scope: {
            project: {
              name: 'admin',
              domain: {
                name: 'Default'
              }
            }
          }
        }
      }
    }).catch(error => handleErrors(error));
  }
}

const handleErrors = e => {
  if (e.response && e.response.status === 401) {
    return when.reject(new AuthenticationError(e));
  } else if (e.response) {
    return when.reject(new KeystoneApiError(e));
  } else if (e.request) {
    return when.reject(
      new ConnectionError(
        'Connection to Keystone API could not be established',
        e
      )
    );
  } else {
    return when.reject(e);
  }
};

export default new KeystoneApiService();
