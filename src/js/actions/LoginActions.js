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
import logger from '../services/logging/LoggingService';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import cookie from 'react-cookie';

export const authenticateUserViaToken = (keystoneAuthTokenId, nextPath) => (
  dispatch,
  getState
) => {
  dispatch(userAuthStarted());
  return dispatch(
    KeystoneApiService.authenticateUserViaToken(keystoneAuthTokenId)
  )
    .then(response => {
      const {
        data: { token },
        headers: { 'x-subject-token': tokenId }
      } = response;
      cookie.save('keystoneAuthTokenId', tokenId, { path: '/' });
      dispatch(userAuthSuccess(tokenId, token));
    })
    .catch(error => {
      dispatch(
        userAuthFailure([
          {
            title: 'Unauthorized',
            message: error.message
          }
        ])
      );
      logger.error('Could not authenticate user via token', error, error.stack);
    });
};

export const authenticateUser = (formData, formFields, nextPath) => (
  dispatch,
  getState
) => {
  dispatch(userAuthStarted());
  return dispatch(
    KeystoneApiService.authenticateUser(formData.username, formData.password)
  )
    .then(response => {
      const {
        data: { token },
        headers: { 'x-subject-token': tokenId }
      } = response;
      cookie.save('keystoneAuthTokenId', tokenId, { path: '/' });
      dispatch(userAuthSuccess(tokenId, token));
    })
    .catch(error => {
      dispatch(
        userAuthFailure([
          {
            title: 'Unauthorized',
            message: error.message
          }
        ])
      );
      logger.error('Could not authenticate user', error, error.stack);
    });
};

export const userAuthStarted = () => ({
  type: LoginConstants.USER_AUTH_STARTED
});

export const userAuthFailure = (errors, formFieldErrors = {}) => ({
  type: LoginConstants.USER_AUTH_FAILURE,
  payload: Map({
    formErrors: fromJS(errors),
    formFieldErrors: fromJS(formFieldErrors)
  }),
  error: true
});

export const userAuthSuccess = (tokenId, token) => ({
  type: LoginConstants.USER_AUTH_SUCCESS,
  payload: { token, tokenId }
});

export const logoutUser = () => dispatch => {
  cookie.remove('keystoneAuthTokenId');
  dispatch(logoutUserSuccess());
  ZaqarWebSocketService.close();
};

export const logoutUserSuccess = () => ({
  type: LoginConstants.LOGOUT_USER_SUCCESS
});
