import React from 'react';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NavTab from './ui/NavTab';
import Dropdown from './ui/dropdown/Dropdown';
import DropdownButton from './ui/dropdown/DropdownButton';
import DropdownToggle from './ui/dropdown/DropdownToggle';
import DropdownItem from './ui/dropdown/DropdownItem';

import TripleoOwlSvg from '../../img/tripleo-owl.svg';

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
                  data-toggle="collapse" data-target="#tripleo-navbar-collapse"
                  aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
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
              <Dropdown>
                <DropdownToggle>
                  Language <b className="caret"></b>
                </DropdownToggle>
                <DropdownItem key="lang-en" onClick={this.props.chooseLanguage.bind(this, 'en')}>
                  English
                </DropdownItem>
              </Dropdown>
            </li>
            <li><a href="#" onClick={this.logout.bind(this)}>Logout</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-primary">
            <NavTab to="/deployment-plan">Deployment Plan</NavTab>
            <NavTab to="/nodes">Nodes</NavTab>
          </ul>
        </div>
      </nav>
    );
  }
}
NavBar.propTypes = {
  chooseLanguage: React.PropTypes.func.isRequired,
  onLogout: React.PropTypes.func.isRequired,
  user: ImmutablePropTypes.map
};
