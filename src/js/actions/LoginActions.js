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

import { Map, fromJS } from 'immutable';

import KeystoneApiService from '../services/KeystoneApiService';
import LoginConstants from '../constants/LoginConstants';
import logger from '../services/logger';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import cookie from 'react-cookie';

export default {
  authenticateUserViaToken(keystoneAuthTokenId, nextPath) {
    return (dispatch, getState) => {
      dispatch(this.userAuthStarted());
      KeystoneApiService.authenticateUserViaToken(keystoneAuthTokenId)
        .then(response => {
          const {
            data: { token },
            headers: { 'x-subject-token': tokenId }
          } = response;
          cookie.save('keystoneAuthTokenId', tokenId, { path: '/' });
          dispatch(this.userAuthSuccess(tokenId, token));
        })
        .catch(error => {
          dispatch(
            this.userAuthFailure([
              {
                title: 'Unauthorized',
                message: error.message
              }
            ])
          );
          logger.error(
            'Could not authenticate user via token',
            error,
            error.stack
          );
        });
    };
  },

  authenticateUser(formData, formFields, nextPath) {
    return (dispatch, getState) => {
      dispatch(this.userAuthStarted());
      KeystoneApiService.authenticateUser(formData.username, formData.password)
        .then(response => {
          const {
            data: { token },
            headers: { 'x-subject-token': tokenId }
          } = response;
          cookie.save('keystoneAuthTokenId', tokenId, { path: '/' });
          dispatch(this.userAuthSuccess(tokenId, token));
        })
        .catch(error => {
          dispatch(
            this.userAuthFailure([
              {
                title: 'Unauthorized',
                message: error.message
              }
            ])
          );
          logger.error('Could not authenticate user', error, error.stack);
        });
    };
  },

  userAuthStarted() {
    return {
      type: LoginConstants.USER_AUTH_STARTED
    };
  },

  userAuthFailure(errors, formFieldErrors = {}) {
    return {
      type: LoginConstants.USER_AUTH_FAILURE,
      payload: Map({
        formErrors: fromJS(errors),
        formFieldErrors: fromJS(formFieldErrors)
      }),
      error: true
    };
  },

  userAuthSuccess(tokenId, token) {
    return {
      type: LoginConstants.USER_AUTH_SUCCESS,
      payload: { token, tokenId }
    };
  },

  logoutUser() {
    return dispatch => {
      cookie.remove('keystoneAuthTokenId');
      ZaqarWebSocketService.close();
      dispatch(this.logoutUserSuccess());
    };
  },

  logoutUserSuccess() {
    return {
      type: LoginConstants.LOGOUT_USER_SUCCESS
    };
  }
};
