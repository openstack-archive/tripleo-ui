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

import { List } from 'immutable';
import { InitialLoggerState } from '../immutableRecords/logger';
import LoggerConstants from '../constants/LoggerConstants';

const initialState = new InitialLoggerState();

export default function loggerReduder(state = initialState, action) {
  switch (action.type) {
    case LoggerConstants.QUEUE_MESSAGE:
      return state.update('messages', messages =>
        messages.push(action.payload)
      );

    case LoggerConstants.WS_AUTHENTICATION_SUCCESS:
      return state.set('authenticated', true);

    case LoggerConstants.FLUSH_MESSAGES_SUCCESS:
      return state.set('messages', List());

    default:
      return state;
  }
}
