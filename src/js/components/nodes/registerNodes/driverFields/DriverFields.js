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

import { defineMessages, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import { format, required } from 'redux-form-validators';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalInput from '../../../ui/reduxForm/HorizontalInput';
import { IPV4_REGEX, FQDN_REGEX, PORT_REGEX } from '../../../../utils/regex';

const messages = defineMessages({
  ipOrFqdnValidatorMessage: {
    id: 'DriverFields.ipOrFqdnValidatorMessage',
    defaultMessage: 'Please enter a valid IPv4 Address or a valid FQDN.'
  },
  portValidationMessage: {
    id: 'DriverFields.portValidationMessage',
    defaultMessage: 'Please enter valid Port number (0 - 65535)'
  }
});

export const DriverFields = ({
  addressLabel,
  intl: { formatMessage },
  passwordLabel,
  portLabel,
  node,
  userLabel
}) => (
  <div>
    <Field
      name={`${node}.pm_addr`}
      component={HorizontalInput}
      id={`${node}.pm_addr`}
      label={addressLabel}
      validate={[
        format({
          with: new RegExp(IPV4_REGEX.source + '|' + FQDN_REGEX.source),
          message: formatMessage(messages.ipOrFqdnValidatorMessage)
        }),
        required()
      ]}
      required
    />
    <Field
      name={`${node}.pm_port`}
      component={HorizontalInput}
      id={`${node}.pm_port`}
      label={portLabel}
      type="number"
      min={0}
      max={65535}
      validate={[
        format({
          with: PORT_REGEX,
          message: formatMessage(messages.portValidationMessage),
          allowBlank: true
        })
      ]}
    />
    <Field
      name={`${node}.pm_user`}
      component={HorizontalInput}
      id={`${node}.pm_user`}
      label={userLabel}
      validate={required()}
      required
    />
    <Field
      name={`${node}.pm_password`}
      component={HorizontalInput}
      id={`${node}.pm_password`}
      label={passwordLabel}
      validate={required()}
      type="password"
      required
    />
  </div>
);
DriverFields.propTypes = {
  addressLabel: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  node: PropTypes.string.isRequired,
  passwordLabel: PropTypes.string.isRequired,
  portLabel: PropTypes.string.isRequired,
  userLabel: PropTypes.string.isRequired
};

export default injectIntl(DriverFields);
