import { createSelector } from 'reselect';

const notifications = state => state.notifications.get('all');

export const getNonViewedNotifications = createSelector(
  notifications, (notifications) => {
    return notifications.filterNot( notification => notification.get('viewed') );
  }
);
