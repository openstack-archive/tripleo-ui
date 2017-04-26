import { defineMessages, FormattedMessage } from 'react-intl';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { getAppConfig } from '../services/utils';
import NavTab from './ui/NavTab';
import I18nDropdown from './i18n/I18nDropdown';

import TripleoOwlSvg from '../../img/tripleo-owl.svg';

const messages = defineMessages({
  toggleNavigation: {
    id: 'NavBar.toggleNavigation',
    defaultMessage: 'Toggle navigation'
  },
  logoutLink: {
    id: 'NavBar.logoutLink',
    defaultMessage: 'Logout'
  },
  deploymentPlanTab: {
    id: 'NavBar.deploymentPlanTab',
    defaultMessage: 'Deployment Plan'
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
    const languages = getAppConfig().languages || {};

    // Only include the I18nDropdown if there's more than one
    // language to choose from.
    return (Object.keys(languages).length > 1) ? (
      <li>
        <I18nDropdown/>
      </li>
    ) : null;
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-pf navbar-fixed-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed"
                  data-toggle="collapse" data-target="#tripleo-navbar-collapse"
                  aria-expanded="false">
            <span className="sr-only">
              <FormattedMessage {...messages.toggleNavigation}/>
            </span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/" id="NavBar__indexLink">
            <img src={TripleoOwlSvg} alt="TripleO"></img>
          </Link>
        </div>
        <div className="navbar-collapse collapse" id="tripleo-navbar-collapse">
          <ul className="nav navbar-nav navbar-utility">
            <li>
              <a id="NavBar__username">
                <span className="pficon pficon-user"></span>
                {this.props.user.get('username')}
              </a>
            </li>
            {this._renderLanguageDropdown()}
            <li>
              <a href="#" onClick={this.logout.bind(this)} id="NavBar__logoutLink">
                <FormattedMessage {...messages.logoutLink}/>
              </a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-primary">
            <NavTab to="/deployment-plan" id="NavBar__deploymentPlanTab">
              <FormattedMessage {...messages.deploymentPlanTab}/>
            </NavTab>
            <NavTab to="/nodes" id="NavBar__nodesTab">
              <FormattedMessage {...messages.nodesTab}/>
            </NavTab>
          </ul>
        </div>
      </nav>
    );
  }
}
NavBar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  user: ImmutablePropTypes.map
};
