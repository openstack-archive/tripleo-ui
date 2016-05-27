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
