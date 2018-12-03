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

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  FormControl,
  Radio,
  FormGroup,
  ControlLabel,
  Col
} from 'patternfly-react';
import cx from 'classnames';

import {
  getValidationState,
  InputDescription,
  InputMessage
} from '../ui/reduxForm/utils';

const messages = defineMessages({
  pushDestinationOptionFalse: {
    id: 'PushDestinationInput.pushDestinationOptionFalse',
    defaultMessage: `Don't push images`
  },
  pushDestinationOptionTrue: {
    id: 'PushDestinationInput.pushDestinationOptionTrue',
    defaultMessage: 'Push to Undercloud registry'
  },
  pushDestinationOptionCustom: {
    id: 'PushDestinationInput.pushDestinationOptionCustom',
    defaultMessage: 'Specify custom registry'
  }
});

export default class PushDestinationInput extends React.Component {
  customRegistryInputRef = createRef();

  render() {
    const {
      id,
      inputColumns,
      labelColumns,
      meta,
      label,
      input: { value, onChange, onBlur, ...inputRest },
      description,
      required
    } = this.props;
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
          <Radio
            {...inputRest}
            checked={value === false}
            onChange={e => onChange(false)}
            onBlur={e => onBlur(false)}
          >
            <FormattedMessage {...messages.pushDestinationOptionFalse} />
          </Radio>
          <Radio
            {...inputRest}
            checked={value === true}
            onChange={e => onChange(true)}
            onBlur={e => onBlur(true)}
          >
            <FormattedMessage {...messages.pushDestinationOptionTrue} />
          </Radio>
          <Radio
            {...inputRest}
            checked={value === this.customRegistryInputRef.value}
            onChange={e => onChange(this.customRegistryInputRef.value)}
            onBlur={e => onBlur(this.customRegistryInputRef.value)}
          >
            <FormattedMessage {...messages.pushDestinationOptionCustom} />
          </Radio>
          <FormControl
            {...inputRest}
            defaultValue="192.168.24.1:8787"
            inputRef={ref => (this.customRegistryInputRef = ref)}
            style={{ marginTop: 4 }}
            type="text"
            onChange={e => onChange(e.target.value)}
            onBlur={e => onBlur(e.target.value)}
            disabled={value !== this.customRegistryInputRef.value}
          />
          <InputMessage {...meta} />
          <InputDescription description={description} />
        </Col>
      </FormGroup>
    );
  }
}
PushDestinationInput.propTypes = {
  description: PropTypes.node,
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  inputColumns: PropTypes.number.isRequired,
  label: PropTypes.node,
  labelColumns: PropTypes.number.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool.isRequired
};
PushDestinationInput.defaultProps = {
  labelColumns: 4,
  inputColumns: 7,
  required: false
};
