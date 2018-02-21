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

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import Notification from './Notification';
import NotificationActions from '../../actions/NotificationActions';
import { getNonViewedNotifications } from '../../selectors/notifications';

class NotificationsToaster extends React.Component {
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

  renderNotifications() {
    return this.props.notifications
      .toList()
      .map(notification => (
        <Notification
          key={notification.id}
          title={notification.title}
          message={notification.message}
          type={notification.type}
          timeoutable={notification.type !== 'error'}
          timerPaused={this.state.isHovered}
          removeNotification={() =>
            this.props.removeNotification(notification.id)
          }
        />
      ));
  }

  render() {
    return (
      <div
        className="toast-notifications-list-pf"
        onMouseEnter={this._handleMouseEnter.bind(this)}
        onMouseLeave={this._handleMouseLeave.bind(this)}
      >
        {this.renderNotifications()}
      </div>
    );
  }
}
NotificationsToaster.propTypes = {
  notifications: ImmutablePropTypes.map.isRequired,
  removeNotification: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(
  NotificationsToaster
);
