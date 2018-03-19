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

import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import DriverFields from './DriverFields';
import { Field } from 'redux-form';
import HorizontalInput from '../../../ui/reduxForm/HorizontalInput';

/**
 * Return one or more Field objects. If multiple return them in an Array.
 */
const customDriverFields = (node, messages, formatMessage) => {
  return (
    <Field
      name={`${node}.pm_relay_id`}
      component={HorizontalInput}
      id={`${node}.pm_relay_id`}
      label={formatMessage(messages.systemId)}
    />
  );
};

const messages = defineMessages({
  address: {
    id: 'IBootDriverFields.address',
    defaultMessage: 'IBoot Host'
  },
  port: {
    id: 'IBootDriverFields.port',
    defaultMessage: 'IBoot Port'
  },
  user: {
    id: 'IBootDriverFields.user',
    defaultMessage: 'IBoot Username'
  },
  password: {
    id: 'IBootDriverFields.password',
    defaultMessage: 'IBoot Password'
  },
  systemId: {
    id: 'IBootDriverFields.relay_id',
    defaultMessage: 'IBoot Relay ID'
  }
});

const IBoot = ({ intl: { formatMessage }, node }) => (
  <DriverFields
    node={node}
    addressLabel={formatMessage(messages.address)}
    portLabel={formatMessage(messages.port)}
    userLabel={formatMessage(messages.user)}
    passwordLabel={formatMessage(messages.password)}
    customDriverFields={customDriverFields(node, messages, formatMessage)}
  />
);
IBoot.propTypes = {
  intl: PropTypes.object.isRequired,
  node: PropTypes.string.isRequired
};

export default injectIntl(IBoot);
