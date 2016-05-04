import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Notification from './Notification';

export default class NotificationsToaster extends React.Component {
  constructor() {
    super();
  }

  renderNotifications(){
    return this.props.notifications.map(notification => {
      return (
        <Notification
          title={notification.title}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          dismissable={notification.dismissable}/>
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
  notifications: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state) {
  return {
    notifications: state.notifications.get('all').sortBy(n => n.timestamp)
    //TODO: write a selector for visible notifications
    //notifications: getVisibileNotifications(state).sortBy(n => n.timestamp)
  };
}

export default connect(mapStateToProps)(NotificationsToaster);
