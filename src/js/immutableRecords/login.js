import { List, Map, Record } from 'immutable';

export const InitialLoginState = Record({
  token: Map(),
  loginForm: Map({
    formErrors: List(),
    formFieldErrors: Map()
  }),
  isAuthenticating: false,
  isAuthenticated: false
});
