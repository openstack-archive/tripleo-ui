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

import { Map } from 'immutable'

import NotificationConstants from '../constants/NotificationConstants'

const initialState = Map({
  all: Map()
})

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case NotificationConstants.NOTIFY: {
      const notification = action.payload
      return state.update('all', all => all.set(notification.id, notification))
    }

    case NotificationConstants.REMOVE_NOTIFICATION:
      return state.update('all', all => all.delete(action.payload))

    case NotificationConstants.NOTIFICATION_VIEWED:
      return state.update('all', all =>
        all.setIn([action.payload, 'viewed'], true)
      )

    default:
      return state
  }
}
