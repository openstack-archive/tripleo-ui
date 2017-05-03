import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { AUTH_URL } from '../constants/KeystoneApiConstants';

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

  authenticateUser(username, password) {
    let req = request(this.defaultRequest({
      data: JSON.stringify({
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
      })
    }));

    // We're passing the req object to the next handler in the chain so that we
    // can inspect response headers later.
    return when(req, (response) => {
      return {
        request: req.request,
        response
      };
    });
  }

  authenticateUserViaToken(keystoneAuthTokenId) {
    let req = request(this.defaultRequest({
      data: JSON.stringify({
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
      })
    }));

    // We're passing the req object to the next handler in the chain so that we
    // can inspect response headers later.
    return when(req, (response) => {
      return {
        request: req.request,
        response
      };
    });

  }
}

export default new KeystoneApiService();
