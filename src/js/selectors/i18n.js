import { createSelector } from 'reselect';

const languageSelector = state => state.i18n.get('language');

export const getLanguage = createSelector(
  [languageSelector], language => language
);
