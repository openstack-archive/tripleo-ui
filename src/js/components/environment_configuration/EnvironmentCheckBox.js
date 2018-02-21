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
import { Checkbox, Col, FormGroup } from 'react-bootstrap';

import {
  getValidationState,
  InputDescription,
  InputMessage
} from '../ui/reduxForm/utils';

/**
 * EnvironmentCheckBox differs from HorizontalCheckBox in being considered as
 * always touched
 */
const EnvironmentCheckBox = ({
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
}) => (
  <FormGroup
    controlId={id}
    validationState={getValidationState({ ...meta, touched: true })}
  >
    <Col smOffset={labelColumns} sm={inputColumns}>
      <Checkbox {...input} {...rest}>
        <span className={cx({ 'required-pf': required })}>{label}</span>
      </Checkbox>
      <InputMessage {...meta} touched />
      <InputDescription description={description} />
    </Col>
  </FormGroup>
);
EnvironmentCheckBox.propTypes = {
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
EnvironmentCheckBox.defaultProps = {
  labelColumns: 5,
  inputColumns: 7,
  required: false,
  type: 'text'
};
export default EnvironmentCheckBox;
