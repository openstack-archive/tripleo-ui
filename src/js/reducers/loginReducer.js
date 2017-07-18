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
import { fromJS } from 'immutable';

import LoginConstants from '../constants/LoginConstants';
import { InitialLoginState } from '../immutableRecords/login';

const initialState = new InitialLoginState();

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LoginConstants.USER_AUTH_STARTED:
      return state.set('isAuthenticating', true);

    case LoginConstants.USER_AUTH_SUCCESS:
      return state
        .set('token', fromJS(action.payload.token))
        .set('tokenId', action.payload.tokenId)
        .set('isAuthenticating', false)
        .set('isAuthenticated', true);

    case LoginConstants.USER_AUTH_FAILURE:
      return state
        .set('loginForm', action.payload)
        .set('isAuthenticating', false)
        .set('isAuthenticated', false)
        .delete('tokenId')
        .delete('token');

    case LoginConstants.LOGOUT_USER_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
