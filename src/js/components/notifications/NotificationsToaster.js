import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Notification from './Notification';
import NotificationActions from '../../actions/NotificationActions';

export default class NotificationsToaster extends React.Component {
  constructor() {
    super();
  }

  renderNotifications(){
    return this.props.notifications.toList().map(notification => {
      return (
        <Notification
          key={notification.id}
          title={notification.title}
          message={notification.message}
          type={notification.type}
          dismissable={notification.dismissable}
          removeNotification={this.props.removeNotification.bind(this, notification.id)}/>
      );
    });
  }

  render() {
    return  (
      <div className="toast-pf-max-width toast-pf-top-right">
        {this.renderNotifications()}
      </div>
    );
  }
}
NotificationsToaster.propTypes = {
  notifications: ImmutablePropTypes.map.isRequired,
  removeNotification: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    notifications: state.notifications.get('all').sortBy(n => n.timestamp)
    //TODO: write a selector for visible notifications
    //notifications: getVisibileNotifications(state).sortBy(n => n.timestamp)
  };
}
function mapDispatchToProps(dispatch) {
  return {
    removeNotification: notificationId =>
      dispatch(NotificationActions.removeNotification(notificationId))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationsToaster);
