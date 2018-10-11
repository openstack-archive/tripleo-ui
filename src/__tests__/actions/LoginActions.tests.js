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

import configureMockStore from 'redux-mock-store';
import cookie from 'react-cookie';
import thunkMiddleware from 'redux-thunk';

import KeystoneApiService from '../../js/services/KeystoneApiService';
import * as LoginActions from '../../js/actions/LoginActions';
import { mockGetIntl } from './utils';
import ZaqarWebSocketService from '../../js/services/ZaqarWebSocketService';

const mockStore = configureMockStore([
  thunkMiddleware.withExtraArgument(mockGetIntl)
]);

describe('LoginActions', () => {
  it('creates action to authenticate user via keystone token', () => {
    const store = mockStore({});
    const response = {
      data: { token: {} },
      headers: { 'x-subject-token': 'someTokenId' }
    };
    KeystoneApiService.authenticateUserViaToken = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(response));

    return store.dispatch(LoginActions.authenticateUserViaToken()).then(() => {
      expect(store.getActions()).toEqual([
        LoginActions.userAuthStarted(),
        LoginActions.userAuthSuccess('someTokenId', {})
      ]);
    });
  });

  it('creates action to login user via username and password', () => {
    const store = mockStore({});
    const response = {
      data: { token: {} },
      headers: { 'x-subject-token': 'someTokenId' }
    };

    cookie.save = jest.fn();
    KeystoneApiService.authenticateUser = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(response));

    return store.dispatch(LoginActions.authenticateUser({})).then(() => {
      expect(cookie.save).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        LoginActions.userAuthStarted(),
        LoginActions.userAuthSuccess('someTokenId', {})
      ]);
    });
  });

  it('creates action to logout user', () => {
    const store = mockStore({});
    cookie.remove = jest.fn();
    ZaqarWebSocketService.close = jest.fn();
    store.dispatch(LoginActions.logoutUser());
    expect(cookie.remove).toHaveBeenCalled();
    expect(ZaqarWebSocketService.close).toHaveBeenCalled();
    expect(store.getActions()).toEqual([LoginActions.logoutUserSuccess()]);
  });
});
