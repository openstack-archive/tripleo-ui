import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Notification from './Notification';
import NotificationActions from '../../actions/NotificationActions';
import { getNonViewedNotifications } from '../../selectors/notifications';

export default class NotificationsToaster extends React.Component {
  constructor() {
    super();
    this.state = {
      isHovered: false
    };
  }

  // handles the mouse hovering over a Toaster
  _handleMouseEnter() {
    this.setState({ isHovered: true });
  }

  // handles the mouse leaving the hover over a Toaster
  _handleMouseLeave() {
    this.setState({ isHovered: false });
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
          timeoutable={notification.timeoutable}
          timerPaused={this.state.isHovered}
          removeNotification={this.props.removeNotification.bind(this, notification.id)}/>
      );
    });
  }

  render() {
    return  (
      <div className="toast-pf-max-width toast-pf-top-right"
           onMouseEnter={this._handleMouseEnter.bind(this)}
           onMouseLeave={this._handleMouseLeave.bind(this)}>
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
    notifications: getNonViewedNotifications(state).sortBy(n => n.timestamp)
  };
}
function mapDispatchToProps(dispatch) {
  return {
    removeNotification: notificationId =>
      dispatch(NotificationActions.notificationViewed(notificationId))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationsToaster);
