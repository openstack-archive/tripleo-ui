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
import cookie from 'react-cookie';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import AuthenticatedContent from './AuthenticatedContent';
import Loader from './ui/Loader';
import LoginActions from '../actions/LoginActions';
import NotificationsToaster from './notifications/NotificationsToaster';

const messages = defineMessages({
  authenticating: {
    id: 'UserAuthenticator.authenticating',
    defaultMessage: 'Authenticating...'
  }
});

/**
 * Takes care of authenticating user. After authentication is resolved, AuthenticatedContent
 * is rendered. No Actions calling API services except Keystone can be dispatched from this
 * component
 */
class UserAuthenticator extends React.Component {
  componentWillMount() {
    this.checkAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps);
  }

  checkAuth(props) {
    const { isAuthenticated, isAuthenticating } = props;
    const keystoneAuthTokenId = cookie.load('keystoneAuthTokenId');
    if (!isAuthenticated && !isAuthenticating && keystoneAuthTokenId) {
      this.props.authenticateUserViaToken(keystoneAuthTokenId);
    }
  }

  render() {
    const { isAuthenticating, isAuthenticated, location } = this.props;
    const keystoneAuthTokenId = cookie.load('keystoneAuthTokenId');

    if (isAuthenticated || isAuthenticating || keystoneAuthTokenId) {
      return (
        <div>
          <Loader
            loaded={this.props.isAuthenticated}
            content={this.props.intl.formatMessage(messages.authenticating)}
            global
          >
            <AuthenticatedContent />
          </Loader>
          <NotificationsToaster />
        </div>
      );
    } else {
      return (
        <Redirect to={{ pathname: '/login', state: { from: location } }} />
      );
    }
  }
}
UserAuthenticator.propTypes = {
  authenticateUserViaToken: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.login.isAuthenticated,
    isAuthenticating: state.login.isAuthenticating
  };
};

const mapDispatchToProps = dispatch => ({
  authenticateUserViaToken: tokenId =>
    dispatch(LoginActions.authenticateUserViaToken(tokenId))
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(UserAuthenticator)
);
