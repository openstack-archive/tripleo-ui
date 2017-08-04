/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { Map } from 'immutable';

import { LANGUAGE_NAMES } from '../constants/i18n';
// TODO(jtomasek): This should rather be in /constants
import { MESSAGES } from '../components/i18n/messages';

const getMessages = () => MESSAGES;
const getAvailableLanguages = () => LANGUAGE_NAMES;
export const getAppConfig = state => state.appConfig;
export const getCurrentLanguage = state => state.i18n.language;

export const getCurrentLanguageMessages = createSelector(
  [getCurrentLanguage, getMessages],
  (language, messages) => messages[language]
);

export const getIntl = createSelector(
  [getCurrentLanguage, getCurrentLanguageMessages],
  (language, messages) => {
    const intlProvider = new IntlProvider(
      { locale: language, messages: messages },
      {}
    );
    const { intl } = intlProvider.getChildContext();
    return intl;
  }
);

export const getEnabledLanguages = createSelector(
  [getAppConfig, getAvailableLanguages],
  (appConfig, languages) =>
    // with immutablejs v 4.0.0 this can be replaced with
    // Map(languages).deleteAll(appConfig.excludedLanguages).sort();
    Map(languages)
      .filterNot((language, key) => appConfig.excludedLanguages.includes(key))
      .sort()
);
