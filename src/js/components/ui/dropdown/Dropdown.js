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

import * as _ from 'lodash';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import DropdownButton from './DropdownButton';
import DropdownItem from './DropdownItem';
import DropdownToggle from './DropdownToggle';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleDropdown() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const children = React.Children.toArray(this.props.children);

    const toggle = _.first(children, child =>
      _.includes([DropdownButton, DropdownToggle], child.type)
    );

    const items = _.map(
      _.filter(children, child => child.type === DropdownItem),
      item =>
        React.cloneElement(item, {
          toggleDropdown: this.toggleDropdown.bind(this)
        })
    );

    // Any other children are prepended to DropdownButton.
    // This can be used to add buttons to Dropdown button group
    const otherChildren = _.reject(children, child =>
      _.includes([DropdownButton, DropdownToggle, DropdownItem], child.type)
    );
    const dropdownClasses = {
      open: this.state.isOpen
    };

    return (
      <span className="dropdown-wrapper">
        <div
          className={ClassNames(
            'dropdown btn-group',
            dropdownClasses,
            this.props.className
          )}
        >
          {otherChildren}
          {React.cloneElement(toggle, {
            toggleDropdown: this.toggleDropdown.bind(this)
          })}
          <ul className="dropdown-menu" role="menu" ref="menu">
            {items}
          </ul>
        </div>
        {this.state.isOpen
          ? <div
              onClick={this.toggleDropdown.bind(this)}
              className="modal-backdrop fade"
            />
          : null}
      </span>
    );
  }
}
Dropdown.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};
