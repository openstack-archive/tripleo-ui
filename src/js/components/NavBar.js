import React from 'react';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NavTab from './ui/NavTab';


export default class NavBar extends React.Component {
  logout(e) {
    e.preventDefault();
    this.props.onLogout();
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-pf navbar-fixed-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed"
                  data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
                  aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">
            <span id="badge">
              <img src="/img/tripleo-owl.svg" alt="TripleO"></img>
            </span>
          </Link>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-utility">
            <li>
              <a>
                <span className="pficon pficon-user"></span>
                {this.props.user.get('username')}
              </a>
            </li>
            <li><a href="#" onClick={this.logout.bind(this)}>Logout</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-primary">
            <NavTab to="/deployment-plan">Deployment Plan</NavTab>
            <NavTab to="/roles">Roles</NavTab>
            <NavTab to="/nodes">Nodes</NavTab>
            <NavTab to="/flavors">Flavors</NavTab>
            <NavTab to="/images">Images</NavTab>
            <NavTab to="/plans/list">Plans</NavTab>
          </ul>
        </div>
      </nav>
    );
  }
}
NavBar.propTypes = {
  onLogout: React.PropTypes.func.isRequired,
  user: ImmutablePropTypes.map
};
