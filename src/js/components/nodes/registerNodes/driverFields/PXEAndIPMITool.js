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

const messages = defineMessages({
  address: {
    id: 'PXEAndIPMIToolDriverFields.address',
    defaultMessage: 'IPMI IP Address or FQDN'
  },
  port: {
    id: 'PXEAndIPMIToolDriverFields.port',
    defaultMessage: 'IPMI Port'
  },
  user: {
    id: 'PXEAndIPMIToolDriverFields.user',
    defaultMessage: 'IPMI Username'
  },
  password: {
    id: 'PXEAndIPMIToolDriverFields.password',
    defaultMessage: 'IPMI Password'
  }
});

const PXEAndIPMITool = ({ intl: { formatMessage }, node }) => (
  <DriverFields
    node={node}
    addressLabel={formatMessage(messages.address)}
    portLabel={formatMessage(messages.port)}
    userLabel={formatMessage(messages.user)}
    passwordLabel={formatMessage(messages.password)}
  />
);
PXEAndIPMITool.propTypes = {
  intl: PropTypes.object.isRequired,
  node: PropTypes.string.isRequired
};

export default injectIntl(PXEAndIPMITool);
