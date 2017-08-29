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

import { createSelector } from 'reselect'
import { IntlProvider } from 'react-intl'

const languageSelector = state => state.i18n.get('language')

const messagesSelector = state => state.i18n.get('messages')

export const getLanguage = createSelector(
  [languageSelector],
  language => language
)

export const getMessages = createSelector(
  [languageSelector, messagesSelector],
  (language, messages) => messages[language]
)

export const getIntl = createSelector(
  [languageSelector, messagesSelector],
  (language, messages) => {
    const intlProvider = new IntlProvider(
      { locale: language, messages: messages[language] },
      {}
    )
    const { intl } = intlProvider.getChildContext()
    return intl
  }
)
