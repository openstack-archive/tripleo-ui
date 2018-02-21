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

import React from 'react';
import PropTypes from 'prop-types';

export const DeploymentPlanStep = ({ children, disabled, title, tooltip }) => (
  <li className={disabled ? 'disabled' : null}>
    <h3>
      <span>{title}</span>
      {tooltip ? (
        <span data-tooltip={tooltip} className="tooltip-right">
          <span className="pficon pficon-info" />
        </span>
      ) : null}
    </h3>
    {children}
  </li>
);

DeploymentPlanStep.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string
};

DeploymentPlanStep.defaultProps = {
  disabled: false
};
