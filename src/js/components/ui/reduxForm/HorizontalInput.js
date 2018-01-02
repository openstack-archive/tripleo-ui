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
import PropTypes from 'prop-types';
import React from 'react';
import { ControlLabel, FormGroup, Col, FormControl } from 'react-bootstrap';

import { getValidationState, InputDescription, InputMessage } from './utils';

const HorizontalInput = ({
  id,
  label,
  labelColumns,
  inputColumns,
  description,
  type,
  input,
  meta,
  required,
  ...rest
}) => {
  return (
    <FormGroup controlId={id} validationState={getValidationState(meta)}>
      <Col
        componentClass={ControlLabel}
        sm={labelColumns}
        className={cx({ 'required-pf': required })}
      >
        {label}
      </Col>
      <Col sm={inputColumns}>
        <FormControl type={type} {...input} {...rest} />
        <InputMessage {...meta} />
        <InputDescription description={description} />
      </Col>
    </FormGroup>
  );
};
HorizontalInput.propTypes = {
  description: PropTypes.node,
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  inputColumns: PropTypes.number.isRequired,
  label: PropTypes.node,
  labelColumns: PropTypes.number.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
};
HorizontalInput.defaultProps = {
  labelColumns: 5,
  inputColumns: 7,
  required: false,
  type: 'text'
};
export default HorizontalInput;
