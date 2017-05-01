import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import React, { PropTypes } from 'react';

import Loader from './ui/Loader';
import NotificationsToaster from './notifications/NotificationsToaster';

const messages = defineMessages({
  authenticating: {
    id: 'UserAuthenticator.authenticating',
    defaultMessage: 'Authenticating...'
  }
});

/**
 * Takes care of authenticating user. User Authentication is triggered in routes
 * 'onEnter' to this component. After authentication is resolved, component children
 * are rendered. No Actions calling API services can be dispatched from this component
 */
class UserAuthenticator extends React.Component {
  render() {
    return (
      <div>
        <Loader
          loaded={this.props.isAuthenticated}
          content={this.props.intl.formatMessage(messages.authenticating)}
          global>
          {this.props.children}
        </Loader>
        <NotificationsToaster />
      </div>
    );
  }
}
UserAuthenticator.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func,
  intl: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.login.isAuthenticated
  };
};

export default injectIntl(connect(mapStateToProps)(UserAuthenticator));
