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
      name={`${node}.pm_system_id`}
      component={HorizontalInput}
      id={`${node}.pm_system_id`}
      label={formatMessage(messages.systemId)}
    />
  );
};

const messages = defineMessages({
  address: {
    id: 'RedfishDriverFields.address',
    defaultMessage: 'Redfish Host'
  },
  port: {
    id: 'RedfishDriverFields.port',
    defaultMessage: 'Redfish Port'
  },
  user: {
    id: 'RedfishDriverFields.user',
    defaultMessage: 'Redfish Username'
  },
  password: {
    id: 'RedfishDriverFields.password',
    defaultMessage: 'Redfish Password'
  },
  systemId: {
    id: 'RedfishDriverFields.systemId',
    defaultMessage: 'Redfish System ID'
  }
});

const Redfish = ({ intl: { formatMessage }, node }) => (
  <DriverFields
    node={node}
    addressLabel={formatMessage(messages.address)}
    portLabel={formatMessage(messages.port)}
    userLabel={formatMessage(messages.user)}
    passwordLabel={formatMessage(messages.password)}
    customDriverFields={customDriverFields(node, messages, formatMessage)}
  />
);
Redfish.propTypes = {
  intl: PropTypes.object.isRequired,
  node: PropTypes.string.isRequired
};

export default injectIntl(Redfish);
