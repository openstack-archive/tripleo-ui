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

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { HelpBlock } from 'react-bootstrap';

/**
 * Determine FormGroup validationState value
 */
export const getValidationState = ({ touched, error, warning }) =>
  cx({
    error: touched && error,
    warning: touched && warning
  }) || null;

export const InputDescription = ({ description }) =>
  description ? <HelpBlock>{description}</HelpBlock> : null;

InputDescription.propTypes = {
  description: PropTypes.node
};

export const InputMessage = ({ touched, error, warning }) =>
  touched
    ? (error ? <HelpBlock>{error}</HelpBlock> : null) ||
      (warning ? <HelpBlock>{warning}</HelpBlock> : null)
    : null;
InputMessage.propTypes = {
  error: PropTypes.node,
  touched: PropTypes.bool,
  warning: PropTypes.node
};
