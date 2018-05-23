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

import PropTypes from 'prop-types';
import React from 'react';

export default class DropdownToggle extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.toggleDropdown();
  }

  render() {
    return (
      <a
        className={this.props.className}
        id={this.props.id}
        data-toggle="dropdown"
        onClick={this.handleClick.bind(this)}
      >
        {this.props.children}
      </a>
    );
  }
}
DropdownToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  toggleDropdown: PropTypes.func
};

DropdownToggle.defaultProps = {
  className: 'dropdown-toggle'
};
