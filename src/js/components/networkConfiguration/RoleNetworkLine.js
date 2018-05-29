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
  getStartingPoint = lineElement => lineElement.getBoundingClientRect().y;

  render() {
    const { className, networkName, networkLinePosition, ...rest } = this.props;
    const { backgroundColor, borderColor } = getNetworkColorStyle(networkName);
    return (
      <li
        className={cx('role-network', className)}
        ref={el => (this.element = el)}
        {...rest}
      >
        <div
          className="role-network-line"
          style={{
            transform:
              networkLinePosition &&
              `scaleY(${networkLinePosition -
                this.getStartingPoint(this.element)}) translateY(50%)`,
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
  className: PropTypes.string
};

export default RoleNetworkLine;
