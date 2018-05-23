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

import ClassNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

export default class DropdownItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
    this.props.toggleDropdown(e);
  }

  render() {
    if (this.props.divider) {
      return <li className="divider" />;
    }

    const classes = {
      disabled: this.props.disabled,
      active: this.props.active
    };

    if (this.props.to) {
      return (
        <li className={ClassNames(this.props.className, classes)}>
          <Link to={this.props.to} onClick={() => this.props.toggleDropdown()}>
            {this.props.children}
          </Link>
        </li>
      );
    }

    if (this.props.onClick) {
      return (
        <li className={ClassNames(this.props.className, classes)}>
          <a
            className="link"
            id={this.props.id}
            onClick={this.handleClick.bind(this)}
          >
            {this.props.children}
          </a>
        </li>
      );
    }

    return (
      <li className={ClassNames(this.props.className, classes)}>
        <a className="link" id={this.props.id}>
          {this.props.children}
        </a>
      </li>
    );
  }
}
DropdownItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  divider: PropTypes.bool,
  id: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
  toggleDropdown: PropTypes.func
};
DropdownItem.defaultProps = {
  active: false,
  disabled: false,
  divider: false
};
