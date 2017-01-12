import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';

import { MESSAGES } from '../components/i18n/I18nProvider';

const languageSelector = state => state.i18n.get('language');

export const getLanguage = createSelector(
  [languageSelector], language => language
);

export const getIntl = createSelector(
  [languageSelector], (language) => {
    const intlProvider = new IntlProvider({ locale: language, messages: MESSAGES[language] }, {});
    const { intl } = intlProvider.getChildContext();
    return intl;
  }
)
