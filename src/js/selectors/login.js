import { createSelector } from 'reselect';

const keystoneAccessSelector = state => state.login.keystoneAccess;

export const isLoggedIn = createSelector(
  [keystoneAccessSelector], (keystoneAccess) => !!keystoneAccess.get('user')
);
