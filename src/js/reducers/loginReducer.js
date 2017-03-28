import LoginConstants from '../constants/LoginConstants';
import { InitialLoginState } from '../immutableRecords/login';

const initialState = new InitialLoginState;

export default function loginReducer(state = initialState, action) {
  switch(action.type) {

  case LoginConstants.USER_AUTH_STARTED:
    return state.set('isAuthenticating', true);

  case LoginConstants.USER_AUTH_SUCCESS:
    return state.set('token', action.payload)
                .set('isAuthenticating', false)
                .set('isAuthenticated', true);

  case LoginConstants.USER_AUTH_FAILURE:
    return state.set('loginForm', action.payload)
                .set('isAuthenticating', false)
                .set('isAuthenticated', false);

  case LoginConstants.LOGOUT_USER_SUCCESS:
    return initialState;

  default:
    return state;

  }
}
