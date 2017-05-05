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
import React, { PropTypes } from 'react';

export default class DropdownButton extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.toggleDropdown();
  }

  render() {
    return (
      <button className={ClassNames('btn dropdown-toggle', this.props.className)}
              onClick={this.handleClick.bind(this)}
              type="button">
        {this.props.children}
        <span className="caret"/>
      </button>
    );
  }
}
DropdownButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  toggleDropdown: PropTypes.func
};
