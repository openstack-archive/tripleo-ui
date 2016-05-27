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
