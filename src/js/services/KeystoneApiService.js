import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import  { AUTH_URL, KEYSTONE_BASE_URL } from '../constants/KeystoneApiConstants';

class KeystoneApiService {
  defaultRequest(additionalAttributes) {
    return _.merge({
      url: AUTH_URL,
      method: 'POST',
      crossOrigin: true,
      contentType: 'application/json',
      type: 'json'
    }, additionalAttributes);
  }

  getRoot() {
    return when(request(this.defaultRequest({
      method: 'GET',
      url: KEYSTONE_BASE_URL
    })));
  }

  authenticateUser(username, password) {
    return when(request(this.defaultRequest({
      data: JSON.stringify({
        auth: {
          tenantName: 'admin',
          passwordCredentials: {
            username: username,
            password: password
          }
        }
      })
    })));
  }

  authenticateUserViaToken(keystoneAuthTokenId) {
    return when(request(this.defaultRequest({
      data: JSON.stringify({
        auth: {
          tenantName: 'admin',
          token: {
            id: keystoneAuthTokenId
          }
        }
      })
    })));
  }
}

export default new KeystoneApiService();
