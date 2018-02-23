/**
 * Copyright 2018 Red Hat Inc.
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

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { getNetworkColorStyle } from './utils';

class RoleNetworkLine extends React.Component {
  getStartingPoint = nicElement => {
    const rect = nicElement.getBoundingClientRect();
    return rect.y + rect.height;
  };

  render() {
    const { className, networkName, networkLinePosition, ...rest } = this.props;
    const { backgroundColor, borderColor } = getNetworkColorStyle(networkName);
    return (
      <li
        className={cx('role-nic', className)}
        ref={el => (this.element = el)}
        {...rest}
      >
        NIC
        <div
          className="role-network-line"
          style={{
            transform: networkLinePosition && 'rotateX(0deg)',
            height:
              networkLinePosition &&
              networkLinePosition - this.getStartingPoint(this.element),
            bottom:
              networkLinePosition &&
              -(networkLinePosition - this.getStartingPoint(this.element)),
            opacity: networkLinePosition && 1,
            backgroundColor,
            borderColor
          }}
        />
        <div
          className="role-network-point"
          style={{
            bottom:
              networkLinePosition &&
              -(networkLinePosition - this.getStartingPoint(this.element) + 5),
            opacity: networkLinePosition && 1,
            backgroundColor,
            borderColor
          }}
        />
      </li>
    );
  }
}
RoleNetworkLine.propTypes = {
  className: PropTypes.string,
  networkLinePosition: PropTypes.number,
  networkName: PropTypes.string.isRequired
};

export default RoleNetworkLine;
