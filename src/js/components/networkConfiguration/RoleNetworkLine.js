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

const RoleNetworkLine = ({ className, style, ...rest }) => (
  <li className={cx('role-network', className)} {...rest}>
    <div className="role-network-line" style={style} />
  </li>
);
RoleNetworkLine.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object.isRequired
};

export default RoleNetworkLine;
