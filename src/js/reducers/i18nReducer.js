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

import { Record } from 'immutable';

const InitialState = Record({
  language: 'en'
});

export default function i18nReducer(state = new InitialState(), action) {
  switch (action.type) {
    case 'CHOOSE_LANGUAGE':
      return state.set('language', action.payload);

    default:
      return state;
  }
}
