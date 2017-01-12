import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';

const languageSelector = state => state.i18n.get('language');

const messagesSelector = state => state.i18n.get('messages');

export const getLanguage = createSelector(
  [languageSelector], language => language
);

export const getMessages = createSelector(
  [languageSelector, messagesSelector], (language, messages) => messages[language]
);

export const getIntl = createSelector(
  [languageSelector, messagesSelector], (language, messages) => {
    const intlProvider = new IntlProvider({ locale: language, messages: messages[language] }, {});
    const { intl } = intlProvider.getChildContext();
    return intl;
  }
)
