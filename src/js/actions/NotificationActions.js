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
import { Notification } from '../immutableRecords/notifications';
import NotificationConstants from '../constants/NotificationConstants';

export default {
  notify(notification) {
    notification.timestamp = Date.now();
    notification.id = shortid.generate();
    return {
      type: NotificationConstants.NOTIFY,
      payload: new Notification(notification)
    };
  },

  removeNotification(notificationId) {
    return {
      type: NotificationConstants.REMOVE_NOTIFICATION,
      payload: notificationId
    };
  },

  notificationViewed(notificationId) {
    return {
      type: NotificationConstants.NOTIFICATION_VIEWED,
      payload: notificationId
    };
  }
};
