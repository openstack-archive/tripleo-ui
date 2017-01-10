import { defineMessages, injectIntl } from 'react-intl';
import React from 'react';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NavTab from './ui/NavTab';

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


class NavBar extends React.Component {
  logout(e) {
    e.preventDefault();
    this.props.onLogout();
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-pf navbar-fixed-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed"
                  data-toggle="collapse" data-target="#tripleo-navbar-collapse"
                  aria-expanded="false">
            <span className="sr-only">
              {this.props.intl.formatMessage(messages.toggleNavigation)}
            </span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">
            <img src={TripleoOwlSvg} alt="TripleO"></img>
          </Link>
        </div>
        <div className="navbar-collapse collapse" id="tripleo-navbar-collapse">
          <ul className="nav navbar-nav navbar-utility">
            <li>
              <a>
                <span className="pficon pficon-user"></span>
                {this.props.user.get('username')}
              </a>
            </li>
            <li>
              <a href="#" onClick={this.logout.bind(this)}>
                {this.props.intl.formatMessage(messages.logoutLink)}
              </a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-primary">
            <NavTab to="/deployment-plan">
              {this.props.intl.formatMessage(messages.deploymentPlanTab)}
            </NavTab>
            <NavTab to="/nodes">
              {this.props.intl.formatMessage(messages.nodesTab)}
            </NavTab>
          </ul>
        </div>
      </nav>
    );
  }
}
NavBar.propTypes = {
  intl: React.PropTypes.object,
  onLogout: React.PropTypes.func.isRequired,
  user: ImmutablePropTypes.map
};

export default injectIntl(NavBar);
