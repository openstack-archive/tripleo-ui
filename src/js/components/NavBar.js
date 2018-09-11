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
import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { getEnabledLanguages } from '../selectors/i18n';
import { getValidationStatusCounts } from '../selectors/validations';
import { logoutUser } from '../actions/LoginActions';
import NavTab from './ui/NavTab';
import I18nDropdown from './i18n/I18nDropdown';
import StatusDropdown from './StatusDropdown';
import UserDropdown from './UserDropdown';
import { toggleValidations } from '../actions/ValidationsActions';
import ValidationsList from './validations/ValidationsList';
import ValidationsToggle from './validations/ValidationsToggle';

import TripleoOwlSvg from '../../img/tripleo-owl-navbar.svg';

const messages = defineMessages({
  toggleNavigation: {
    id: 'NavBar.toggleNavigation',
    defaultMessage: 'Toggle navigation'
  },
  plansTab: {
    id: 'NavBar.plansTab',
    defaultMessage: 'Plans'
  },
  debug: {
    id: 'NavBar.debug',
    defaultMessage: 'Debug'
  },
  nodesTab: {
    id: 'Navbar.nodesTab',
    defaultMessage: 'Nodes'
  }
});

class NavBar extends React.Component {
  logout(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  _renderLanguageDropdown() {
    // Only include the I18nDropdown if there's more than one
    // language to choose from.
    return this.props.languages.size > 1 ? (
      <li>
        <I18nDropdown />
      </li>
    ) : null;
  }

  _renderHelpDropdown() {
    return (
      <li>
        <StatusDropdown />
      </li>
    );
  }

  render() {
    const {
      executionsLoaded,
      showValidations,
      toggleValidations,
      validationStatusCounts,
      validationsLoaded
    } = this.props;
    return (
      <header>
        <nav
          className="navbar navbar-default navbar-pf navbar-fixed-top"
          role="navigation"
        >
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#tripleo-navbar-collapse"
              aria-expanded="false"
            >
              <span className="sr-only">
                <FormattedMessage {...messages.toggleNavigation} />
              </span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link className="navbar-brand" to="/" id="NavBar__indexLink">
              <img src={TripleoOwlSvg} alt="TripleO" />
            </Link>
          </div>
          <div
            className="navbar-collapse collapse"
            id="tripleo-navbar-collapse"
          >
            <ul className="nav navbar-nav navbar-utility">
              {this._renderLanguageDropdown()}
              {this._renderHelpDropdown()}
              <ValidationsToggle
                executionsLoaded={executionsLoaded}
                showValidations={showValidations}
                toggleValidations={toggleValidations}
                validationStatusCounts={validationStatusCounts}
                validationsLoaded={validationsLoaded}
              />
              <UserDropdown
                name={this.props.user.get('name')}
                logout={this.logout.bind(this)}
              />
            </ul>
            <ul className="nav navbar-nav navbar-primary">
              <NavTab to="/plans" id="NavBar__PlansTab">
                <FormattedMessage {...messages.plansTab} />
              </NavTab>
              <NavTab to="/nodes" id="NavBar__nodesTab">
                <FormattedMessage {...messages.nodesTab} />
              </NavTab>
            </ul>
          </div>
          <ValidationsList />
        </nav>
      </header>
    );
  }
}
NavBar.propTypes = {
  executionsLoaded: PropTypes.bool.isRequired,
  languages: ImmutablePropTypes.map.isRequired,
  logoutUser: PropTypes.func.isRequired,
  showValidations: PropTypes.bool.isRequired,
  toggleValidations: PropTypes.func.isRequired,
  user: ImmutablePropTypes.map,
  validationStatusCounts: ImmutablePropTypes.map.isRequired,
  validationsLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  executionsLoaded: state.executions.get('executionsLoaded'),
  languages: getEnabledLanguages(state),
  showValidations: state.validations.showValidations,
  user: state.login.getIn(['token', 'user']),
  validationStatusCounts: getValidationStatusCounts(state),
  validationsLoaded: state.validations.get('validationsLoaded')
});
const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  toggleValidations: () => dispatch(toggleValidations())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
