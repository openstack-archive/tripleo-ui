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
        .then(response => {
          cookie.save('keystoneAuthTokenId', response.access.token.id, {
            path: '/'
          });
          dispatch(this.userAuthSuccess(response.access));
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
        .then(response => {
          cookie.save('keystoneAuthTokenId', response.access.token.id, {
            path: '/'
          });
          dispatch(this.userAuthSuccess(response.access));
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

  userAuthSuccess(keystoneAccess) {
    return {
      type: LoginConstants.USER_AUTH_SUCCESS,
      payload: fromJS(keystoneAccess)
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
