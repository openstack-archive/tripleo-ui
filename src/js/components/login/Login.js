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

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';

import FormErrorList from '../ui/forms/FormErrorList';
import I18nActions from '../../actions/I18nActions';
import Loader from '../ui/Loader';
import LoginInput from '../ui/forms/LoginInput';
import LanguageInput from './LanguageInput';
import LoginActions from '../../actions/LoginActions';
import NotificationsToaster from '../notifications/NotificationsToaster';

import LogoSvg from '../../../img/logo.svg';
import TripleoOwlSvg from '../../../img/tripleo-owl.svg';

const messages = defineMessages({
  authenticating: {
    id: 'UserAuthenticator.authenticating',
    defaultMessage: 'Authenticating...'
  },
  username: {
    id: 'Login.username',
    defaultMessage: 'Username'
  },
  usernameRequired: {
    id: 'Login.usernameRequired',
    defaultMessage: 'Username is required.'
  },
  password: {
    id: 'Login.password',
    defaultMessage: 'Password'
  },
  passwordRequired: {
    id: 'Login.passwordRequired',
    defaultMessage: 'Password is required.'
  },
  login: {
    id: 'Login.login',
    defaultMessage: 'Log In'
  },
  welcome: {
    id: 'Login.welcome',
    defaultMessage: 'Welcome!'
  },
  description: {
    id: 'Login.description',
    defaultMessage: 'This tool will walk you through the process of configuring and ' +
      'deploying an OpenStack environment.'
  }
});

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false
    };
  }
  componentWillMount() {
    ReactDOM.findDOMNode(document.documentElement).className = 'login-pf';
  }

  componentDidUpdate() {
    if (!this.props.isAuthenticated || this.props.isAuthenticating) {
      this.invalidateLoginForm(this.props.formFieldErrors.toJS());
    }
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(document.documentElement).className = '';
  }

  invalidateLoginForm(formFieldErrors) {
    this.refs.form.updateInputsWithError(formFieldErrors);
  }

  _enableButton() {
    this.setState({ canSubmit: true });
  }

  _disableButton() {
    this.setState({ canSubmit: false });
  }

  handleLogin(formData, resetForm, invalidateForm) {
    const formFields = Object.keys(this.refs.form.inputs);
    this.props.authenticateUser(formData, formFields);
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const {
      formErrors,
      isAuthenticating,
      isAuthenticated,
      intl: { formatMessage }
    } = this.props;

    if (!isAuthenticated) {
      return (
        <div>
          <span id="badge">
            <img src={LogoSvg} alt="TripleO" />
          </span>
          <Loader
            content={formatMessage(messages.authenticating)}
            loaded={!isAuthenticating}
            global
          />
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <div id="brand">
                  <img src={TripleoOwlSvg} alt="TripleO" />
                </div>
              </div>
              <div className="col-sm-7 col-md-6 col-lg-5 login">
                <FormErrorList errors={formErrors.toJS()} />
                <Formsy.Form
                  ref="form"
                  role="form"
                  className="form-horizontal"
                  onSubmit={this.handleLogin.bind(this)}
                  onValid={this._enableButton.bind(this)}
                  onInvalid={this._disableButton.bind(this)}
                >
                  <LanguageInput
                    name="language"
                    chooseLanguage={this.props.chooseLanguage}
                    language={this.props.language}
                  />
                  <LoginInput
                    name="username"
                    placeholder={formatMessage(messages.username)}
                    title={formatMessage(messages.username)}
                    validationError={formatMessage(messages.usernameRequired)}
                    required
                    autoFocus
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    placeholder={formatMessage(messages.password)}
                    title={formatMessage(messages.password)}
                    validationError={formatMessage(messages.passwordRequired)}
                    required
                  />
                  <div className="form-group">
                    <div className="col-xs-offset-8 col-xs-4 col-sm-4 col-md-4 submit">
                      <button
                        type="submit"
                        disabled={!this.state.canSubmit || isAuthenticating}
                        className="btn btn-primary btn-lg"
                        tabIndex="4"
                        id="Login__loginButton"
                      >
                        <FormattedMessage {...messages.login} />
                      </button>
                    </div>
                  </div>
                </Formsy.Form>
              </div>
              <div className="col-sm-5 col-md-6 col-lg-7 details">
                <p>
                  <strong><FormattedMessage {...messages.welcome} /></strong>
                  <br />
                  <FormattedMessage {...messages.description} />
                </p>
              </div>
            </div>
          </div>
          <NotificationsToaster />
        </div>
      );
    } else {
      return <Redirect to={from} />;
    }
  }
}
Login.propTypes = {
  authenticateUser: PropTypes.func.isRequired,
  chooseLanguage: PropTypes.func.isRequired,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  intl: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  language: PropTypes.string,
  location: PropTypes.object,
  userLoggedIn: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    formErrors: state.login.getIn(['loginForm', 'formErrors']),
    formFieldErrors: state.login.getIn(['loginForm', 'formFieldErrors']),
    isAuthenticated: state.login.isAuthenticated,
    isAuthenticating: state.login.get('isAuthenticating'),
    language: state.i18n.get('language', 'en'),
    userLoggedIn: state.login.hasIn(['keystoneAccess', 'user'])
  };
}

const mapDispatchToProps = dispatch => {
  return {
    chooseLanguage: language => dispatch(I18nActions.chooseLanguage(language)),
    authenticateUser: (formData, formFields, nextPath) =>
      dispatch(LoginActions.authenticateUser(formData, formFields, nextPath))
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Login));
