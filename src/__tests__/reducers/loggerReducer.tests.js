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

import { List, Map } from 'immutable'

// TODO(hpokorny): remove this import when store is correctly mocked
import store from '../../js/store' // eslint-disable-line no-unused-vars

import { InitialLoggerState } from '../../js/immutableRecords/logger'
import LoggerActions from '../../js/actions/LoggerActions'
import loggerReducer from '../../js/reducers/loggerReducer'

describe('loggerReducer state', () => {
  describe('default state', () => {
    let state

    beforeEach(() => {
      state = loggerReducer(undefined, { type: 'undefined-action' })
    })

    it('`authenticated` is false', () => {
      expect(state.get('authenticated')).toBe(false)
    })

    it('`messages` is empty', () => {
      expect(state.get('messages').isEmpty()).toBe(true)
    })
  })

  describe('QUEUE_MESSAGE', () => {
    it('enqueues a messages', () => {
      let state = loggerReducer(
        new InitialLoggerState(),
        LoggerActions.queueMessage(1)
      )
      expect(state.get('messages').size).toEqual(1)
    })
  })

  describe('FLUSH_MESSAGES_SUCCESS', () => {
    it('flushes messages', () => {
      let state = loggerReducer(
        Map({
          messages: List([1, 2, 3]),
          authenticated: true
        }),
        LoggerActions.flushMessagesSuccess()
      )

      expect(state.get('messages').isEmpty()).toBe(true)
    })
  })
})
