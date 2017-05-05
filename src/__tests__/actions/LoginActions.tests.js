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

import KeystoneApiService from '../../js/services/KeystoneApiService';
import LoginActions from '../../js/actions/LoginActions';
import cookie from 'react-cookie';

let mockKeystoneAccess = {
  token: {
    id: 'someTokenIdString'
  },
  user: 'admin',
  serviceCatalog: 'service catalog',
  metadata: 'some metadata'
};

describe('LoginActions', () => {
  xit('creates action to authenticate user via keystone token', () => {
    spyOn(KeystoneApiService, 'authenticateUserViaToken');
    LoginActions.authenticateUserViaToken('someTokenIdString');
    expect(KeystoneApiService.authenticateUserViaToken).toHaveBeenCalledWith('someTokenIdString');
  });

  xit('creates action to login user with keystoneAccess response', () => {
    spyOn(cookie, 'save');
    LoginActions.loginUser(mockKeystoneAccess);
    expect(cookie.save).toHaveBeenCalledWith(
      'keystoneAuthTokenId',
      mockKeystoneAccess.token.id
    );
  });

  xit('creates action to logout user', () => {
    spyOn(cookie, 'remove');
    LoginActions.logoutUser();
    expect(cookie.remove).toHaveBeenCalled();
  });
});
