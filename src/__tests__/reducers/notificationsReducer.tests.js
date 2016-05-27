import matchers from 'jasmine-immutable-matchers';
import { Map } from 'immutable';

import { Notification } from '../../js/immutableRecords/notifications';
import NotificationConstants from '../../js/constants/NotificationConstants';
import notificationsReducer from '../../js/reducers/notificationsReducer';

describe('notificationsReducer', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

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
    expect(notificationsReducer(initialState, action)).toEqualImmutable(
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
    expect(notificationsReducer(testState, action)).toEqualImmutable(
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
    expect(notificationsReducer(testState, action)).toEqualImmutable(
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
