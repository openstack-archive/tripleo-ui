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
import { startCase } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { getNetworkColorStyle } from './utils';

const NetworkListItem = ({ className, lineRef, name, ...rest }) => {
  const { borderColor, backgroundColor } = getNetworkColorStyle(name);
  return (
    <li className={cx('network', className)} {...rest}>
      <div ref={lineRef} className="network-line" style={{ borderColor }} />
      <div className="network-box" style={{ backgroundColor }}>
        {startCase(name)}
      </div>
    </li>
  );
};
NetworkListItem.propTypes = {
  className: PropTypes.string,
  lineRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default NetworkListItem;
