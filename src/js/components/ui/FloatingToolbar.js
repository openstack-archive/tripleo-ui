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

const FloatingToolbar = ({
  children,
  top,
  bottom,
  left,
  right,
  style,
  ...rest
}) => (
  <div
    style={{
      position: 'absolute',
      padding: '10px 15px',
      background: 'rgba(255, 255, 255, .9)',
      [bottom ? 'bottom' : 'top']: 0,
      [right ? 'right' : 'left']: 0,
      right: right ? 0 : 'auto',
      borderRadius: 0,
      [`border${top ? 'Bottom' : 'Top'}${left ? 'Right' : 'Left'}Radius`]: 4,
      [left ? 'borderRight' : 'borderLeft']: '1px solid #d1d1d1',
      [top ? 'borderBottom' : 'borderTop']: '1px solid #d1d1d1',
      ...style
    }}
    {...rest}
  >
    {children}
  </div>
);
FloatingToolbar.propTypes = {
  bottom: PropTypes.bool,
  children: PropTypes.node.isRequired,
  left: PropTypes.bool,
  right: PropTypes.bool,
  style: PropTypes.object,
  top: PropTypes.bool
};

export default FloatingToolbar;
