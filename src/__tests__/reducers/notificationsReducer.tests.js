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

import { Map } from 'immutable';

import { Notification } from '../../js/immutableRecords/notifications';
import NotificationConstants from '../../js/constants/NotificationConstants';
import notificationsReducer from '../../js/reducers/notificationsReducer';

describe('notificationsReducer', () => {
  const initialState = Map({ all: Map() });
  const testNotification = new Notification({
    title: 'Title',
    message: 'This is the notification message',
    timestamp: 123123123,
    id: 'someId'
  });

  it('should return initial state', () => {
    expect(notificationsReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle NOTIFY', () => {
    const action = {
      type: NotificationConstants.NOTIFY,
      payload: testNotification
    };
    expect(notificationsReducer(initialState, action)).toEqual(
      Map({
        all: Map({
          someId: testNotification
        })
      })
    );
  });

  it('should handle REMOVE_NOTIFICATION', () => {
    const action = {
      type: NotificationConstants.REMOVE_NOTIFICATION,
      payload: 'someId'
    };
    const testState = Map({
      all: Map({
        someId: testNotification
      })
    });
    expect(notificationsReducer(testState, action)).toEqual(
      Map({
        all: Map()
      })
    );
  });

  it('should handle NOTIFICATION_VIEWED', () => {
    const action = {
      type: NotificationConstants.NOTIFICATION_VIEWED,
      payload: 'someId'
    };
    const testState = Map({
      all: Map({
        someId: testNotification
      })
    });
    expect(notificationsReducer(testState, action)).toEqual(
      Map({
        all: Map({
          someId: new Notification({
            title: 'Title',
            message: 'This is the notification message',
            timestamp: 123123123,
            id: 'someId',
            viewed: true
          })
        })
      })
    );
  });
});
