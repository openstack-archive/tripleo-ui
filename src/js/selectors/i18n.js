import { createSelector } from 'reselect';

const languageSelector = state => state.i18n.get('language');

const messagesSelector = state => state.i18n.get('messages');

export const getLanguage = createSelector(
  [languageSelector], language => language
);

export const getMessages = createSelector(
  [languageSelector, messagesSelector], (language, messages) => messages[language]
);
