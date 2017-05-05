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

import shortid from 'shortid';

import { Notification } from '../../js/immutableRecords/notifications';
import NotificationActions from '../../js/actions/NotificationActions';
import NotificationConstants from '../../js/constants/NotificationConstants';

describe('Notification actions', () => {
  it('should create an action to notify', () => {
    const testId = 'someNotificationId';
    const testTimestamp = 123123123;

    spyOn(shortid, 'generate').and.returnValue(testId);
    spyOn(Date, 'now').and.returnValue(testTimestamp);

    const notificationObject = {
      title: 'Title',
      message: 'This is the notification message'
    };

    const expectedNotification = new Notification({
      title: 'Title',
      message: 'This is the notification message',
      timestamp: testTimestamp,
      id: testId
    });

    const expectedAction = {
      type: NotificationConstants.NOTIFY,
      payload: expectedNotification
    };

    expect(NotificationActions.notify(notificationObject)).toEqual(expectedAction);
  });

  it('should create an action to remove notification', () => {
    const expectedAction = {
      type: NotificationConstants.REMOVE_NOTIFICATION,
      payload: 123
    };
    expect(NotificationActions.removeNotification(123)).toEqual(expectedAction);
  });

  it('should create an action to mark notification as viewed', () => {
    const expectedAction = {
      type: NotificationConstants.NOTIFICATION_VIEWED,
      payload: 123
    };
    expect(NotificationActions.notificationViewed(123)).toEqual(expectedAction);
  });
});
