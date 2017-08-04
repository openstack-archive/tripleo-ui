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

import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NavTab from './ui/NavTab';
import I18nDropdown from './i18n/I18nDropdown';

import TripleoOwlSvg from '../../img/tripleo-owl-navbar.svg';

const messages = defineMessages({
  toggleNavigation: {
    id: 'NavBar.toggleNavigation',
    defaultMessage: 'Toggle navigation'
  },
  logoutLink: {
    id: 'NavBar.logoutLink',
    defaultMessage: 'Logout'
  },
  plansTab: {
    id: 'NavBar.plansTab',
    defaultMessage: 'Plans'
  },
  nodesTab: {
    id: 'Navbar.nodesTab',
    defaultMessage: 'Nodes'
  }
});

export default class NavBar extends React.Component {
  logout(e) {
    e.preventDefault();
    this.props.onLogout();
  }

  _renderLanguageDropdown() {
    // Only include the I18nDropdown if there's more than one
    // language to choose from.
    return this.props.languages.size > 1
      ? <li>
          <I18nDropdown />
        </li>
      : null;
  }

  render() {
    return (
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
        <div className="navbar-collapse collapse" id="tripleo-navbar-collapse">
          <ul className="nav navbar-nav navbar-utility">
            <li>
              <a id="NavBar__username">
                <span className="pficon pficon-user" />
                {this.props.user.get('name')}
              </a>
            </li>
            {this._renderLanguageDropdown()}
            <li>
              <a
                href="#"
                onClick={this.logout.bind(this)}
                id="NavBar__logoutLink"
              >
                <FormattedMessage {...messages.logoutLink} />
              </a>
            </li>
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
      </nav>
    );
  }
}
NavBar.propTypes = {
  languages: ImmutablePropTypes.map.isRequired,
  onLogout: PropTypes.func.isRequired,
  user: ImmutablePropTypes.map
};
