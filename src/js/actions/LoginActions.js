import { browserHistory } from 'react-router';
import { Map, fromJS } from 'immutable';

import KeystoneApiErrorHandler from '../services/KeystoneApiErrorHandler';
import KeystoneApiService from '../services/KeystoneApiService';
import LoginConstants from '../constants/LoginConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import logger from '../services/logger';
import cookie from 'react-cookie';

export default {
  authenticateUserViaToken(keystoneAuthTokenId, nextPath) {
    return (dispatch, getState) => {
      dispatch(this.userAuthStarted());
      KeystoneApiService.authenticateUserViaToken(keystoneAuthTokenId)
        .then(result => {
          const tokenId = result.request.getResponseHeader('X-Subject-Token');
          let response = result.response;
          response.token.id = tokenId;
          cookie.save('keystoneAuthTokenId', tokenId, { path: '/' });
          dispatch(this.userAuthSuccess(response.token));
          ZaqarWebSocketService.init(getState, dispatch);
          browserHistory.push(nextPath);
        })
        .catch(error => {
          logger.error(
            'Error in LoginActions.authenticateUserViaToken',
            error.stack || error
          );
          let errorHandler = new KeystoneApiErrorHandler(error);
          cookie.remove('keystoneAuthTokenId');
          browserHistory.push({
            pathname: '/login',
            query: { nextPath: nextPath }
          });
          dispatch(this.userAuthFailure(errorHandler.errors));
        });
    };
  },

  authenticateUser(formData, formFields, nextPath) {
    return (dispatch, getState) => {
      dispatch(this.userAuthStarted());
      KeystoneApiService.authenticateUser(formData.username, formData.password)
        .then(result => {
          const tokenId = result.request.getResponseHeader('X-Subject-Token');
          let response = result.response;
          response.token.id = tokenId;
          cookie.save('keystoneAuthTokenId', tokenId, { path: '/' });
          dispatch(this.userAuthSuccess(response.token));
          ZaqarWebSocketService.init(getState, dispatch);
          browserHistory.push(nextPath);
        })
        .catch(error => {
          logger.error(
            'Error in LoginActions.authenticateUser',
            error.stack || error
          );
          let errorHandler = new KeystoneApiErrorHandler(error, formFields);
          dispatch(
            this.userAuthFailure(
              errorHandler.errors,
              errorHandler.formFieldErrors
            )
          );
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

  userAuthSuccess(token) {
    return {
      type: LoginConstants.USER_AUTH_SUCCESS,
      payload: fromJS(token)
    };
  },

  logoutUser() {
    return dispatch => {
      browserHistory.push('/login');
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
