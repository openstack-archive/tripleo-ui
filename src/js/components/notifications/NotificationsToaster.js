import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Notification from './Notification';

export default class NotificationsToaster extends React.Component {
  constructor() {
    super();
    this.state = {
      toasterNotification: null,
      nextNotification: null,
      timestamp: Date.now(),
      isHovering: false,
      timeout: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this._onNotificationsChange(nextProps);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.toasterNotification) {
      if (nextState.toasterNotification != this.state.toasterNotification) {
        this.startTimer();
      }
    }

    if (this.state.isHovering && !nextState.isHovering && !this.state.timeout) {
      this.showNextNotification();
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  _onNotificationsChange(nextProps) {
    let now = new Date();

    // Determine which notifications are new
    let newNotifications = nextProps.notifications
      .filter(notification => notification.timestamp > this.state.timestamp);
    if (!newNotifications.isEmpty()) {
      let nextNotification = newNotifications.first();

      if (!this.state.toasterNotification || !this.state.isHovering) {
        this.setState({toasterNotification: nextNotification, timestamp: now.getTime()});
      }
      else {
        this.setState({nextNotification: nextNotification, timestamp: now.getTime()});
      }
    }
  }

  showNextNotification() {
    this.setState({
      toasterNotification: this.state.nextNotification,
      nextNotification: null
    });
  }

  toasterTimeout() {
    this.setState({timeout: false});
    if (!this.state.isHovering) {
      this.showNextNotification();
    }
  }

  startTimer() {
    // Clear any previous timers
    this.clearTimer();
    this.setState({timeout: setTimeout(this.toasterTimeout.bind(this), 8000)});
  }

  clearTimer() {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
      this.setState({timeout: false});
    }
  }

  closeNotification() {
    this.setState({isHovering: false});
    this.clearTimer();
    this.showNextNotification();
  }

  notificationHover(isHover) {
    this.setState({isHovering: isHover});
  }

  render() {
    return this.state.toasterNotification ? (
      <div className="notification-toaster col-lg-5 col-md-6 col-sm-8 col-xs-12">
        <Notification
          title={this.state.toasterNotification.title}
          message={this.state.toasterNotification.message}
          type={this.state.toasterNotification.type}
          dismissable
          removeNotification={this.closeNotification.bind(this)}
          onMouseEnter={this.notificationHover.bind(this, true)}
          onMouseLeave={this.notificationHover.bind(this, false)}/>
      </div>
    ) : null;
  }
}
NotificationsToaster.propTypes = {
  notifications: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state) {
  return {
    notifications: state.notifications.get('all').sortBy(n => n.timestamp)
  };
}

export default connect(mapStateToProps)(NotificationsToaster);
