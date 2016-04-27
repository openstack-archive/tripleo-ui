import { createSelector } from 'reselect';

const keystoneAccessSelector = state => state.login.keystoneAccess;

export const getKeyStoneAccess = createSelector(
  [keystoneAccessSelector], (keystoneAccess) => keystoneAccess
);
