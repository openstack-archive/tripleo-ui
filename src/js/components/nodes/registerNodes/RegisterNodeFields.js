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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Field, formValueSelector } from 'redux-form';
import { format, length, numericality, required } from 'redux-form-validators';
import React from 'react';
import PropTypes from 'prop-types';

import Fieldset from '../../ui/reduxForm/Fieldset';
import HorizontalInput from '../../ui/reduxForm/HorizontalInput';
import HorizontalSelect from '../../ui/reduxForm/HorizontalSelect';
import { arrayOfFormat } from '../../ui/reduxForm/validators';
import { NODE_NAME_REGEX, MAC_ADDRESS_REGEX } from '../../../utils/regex';
import PXEAndIPMITool from './driverFields/PXEAndIPMITool';
import PXEAndDRAC from './driverFields/PXEAndDRAC';

const messages = defineMessages({
  enterValidMacAddress: {
    id: 'RegisterNodeForm.enterValidMacAddress',
    defaultMessage: 'Please enter a list of valid MAC Addresses.'
  },
  nodeNameRegexp: {
    id: 'RegisterNodeForm.nodeNameRegexp',
    defaultMessage:
      'Name may only consist of RFC3986 unreserved characters: alphanumeric, hyphen (-),' +
      ' period (.), underscore (_) and tilde (~) characters.'
  },
  nodeNameMaxLength: {
    id: 'RegisterNodeForm.nodeNameMaxLength',
    defaultMessage: 'Node name can have up to 255 characters.'
  },
  nodeDetail: {
    id: 'RegisterNodeForm.nodeDetail',
    defaultMessage: 'Node Detail'
  },
  general: {
    id: 'RegisterNodeForm.General',
    defaultMessage: 'General'
  },
  name: {
    id: 'RegisterNodeForm.name',
    defaultMessage: 'Name'
  },
  management: {
    id: 'RegisterNodeForm.management',
    defaultMessage: 'Management'
  },
  driver: {
    id: 'RegisterNodeForm.driver',
    defaultMessage: 'Driver'
  },
  hardware: {
    id: 'RegisterNodeForm.hardware',
    defaultMessage: 'Hardware'
  },
  architecture: {
    id: 'RegisterNodeForm.architecture',
    defaultMessage: 'Architecture'
  },
  cpuCount: {
    id: 'RegisterNodeForm.cpuCount',
    defaultMessage: 'CPU count'
  },
  memoryMb: {
    id: 'RegisterNodeForm.memoryMb',
    defaultMessage: 'Memory (MB)'
  },
  diskGb: {
    id: 'RegisterNodeForm.diskGb',
    defaultMessage: 'Disk (GB)'
  },
  networking: {
    id: 'RegisterNodeForm.networking',
    defaultMessage: 'Networking'
  },
  nicMacAddresses: {
    id: 'RegisterNodeForm.nicMacAddresses',
    defaultMessage: 'NIC MAC Addresses'
  },
  macAddressesDescription: {
    id: 'RegisterNodeForm.macAddressesDescription',
    defaultMessage:
      'If you are specifying multiple MAC Addresses, please enter a comma separated list. (e.g. aa:bb:cc:dd:ee:ff,12:34:56:78:90:xx,do:re:mi:fa:so:ra)'
  }
});

const renderDriverFields = (driverName, node) => {
  switch (driverName) {
    case 'pxe_ipmitool':
      return <PXEAndIPMITool node={node} />;
    case 'pxe_drac':
      return <PXEAndDRAC node={node} />;
    default:
      return null;
  }
};

const RegisterNodeFields = ({
  node,
  intl: { formatMessage },
  selectedDriver
}) => (
  <div>
    <h4>
      <FormattedMessage {...messages.nodeDetail} />
    </h4>
    <Fieldset legend={formatMessage(messages.general)}>
      <Field
        name={`${node}.name`}
        component={HorizontalInput}
        id={`${node}.name`}
        label={formatMessage(messages.name)}
        validate={[
          format({
            with: NODE_NAME_REGEX,
            message: formatMessage(messages.nodeNameRegexp),
            allowBlank: true
          }),
          length({ max: 255 })
        ]}
      />
    </Fieldset>
    <Fieldset legend={formatMessage(messages.management)}>
      <Field
        name={`${node}.pm_type`}
        component={HorizontalSelect}
        id={`${node}.pm_type`}
        label={formatMessage(messages.driver)}
        validate={required()}
        required
      >
        {['pxe_ipmitool', 'pxe_drac'].map((value, index) => (
          <option key={index}>{value}</option>
        ))}
      </Field>
      {renderDriverFields(selectedDriver, node)}
    </Fieldset>
    <Fieldset legend={formatMessage(messages.hardware)}>
      <Field
        name={`${node}.arch`}
        component={HorizontalSelect}
        id={`${node}.arch`}
        label={formatMessage(messages.architecture)}
      >
        {[undefined, 'x86_64', 'i386'].map((value, index) => (
          <option key={index}>{value}</option>
        ))}
      </Field>
      <Field
        name={`${node}.cpu`}
        component={HorizontalInput}
        id={`${node}.cpu`}
        label={formatMessage(messages.cpuCount)}
        type="number"
        min={1}
        validate={numericality({
          int: true,
          '>': 0,
          allowBlank: true
        })}
      />
      <Field
        name={`${node}.memory`}
        component={HorizontalInput}
        id={`${node}.memory`}
        label={formatMessage(messages.memoryMb)}
        type="number"
        min={1}
        validate={numericality({
          int: true,
          '>': 0,
          allowBlank: true
        })}
      />
      <Field
        name={`${node}.disk`}
        component={HorizontalInput}
        id={`${node}.disk`}
        label={formatMessage(messages.diskGb)}
        type="number"
        min={1}
        validate={numericality({
          int: true,
          '>': 0,
          allowBlank: true
        })}
      />
    </Fieldset>
    <Fieldset legend={formatMessage(messages.networking)}>
      <Field
        name={`${node}.mac`}
        component={HorizontalInput}
        id={`${node}.mac`}
        label={formatMessage(messages.nicMacAddresses)}
        description={formatMessage(messages.macAddressesDescription)}
        validate={[
          arrayOfFormat({
            with: MAC_ADDRESS_REGEX,
            message: messages.enterValidMacAddress
          })
        ]}
        parse={value => value.split(',')}
        required
      />
    </Fieldset>
  </div>
);
RegisterNodeFields.propTypes = {
  intl: PropTypes.object.isRequired,
  node: PropTypes.string.isRequired,
  selectedDriver: PropTypes.string.isRequired
};

const selector = formValueSelector('registerNodesForm');
const mapStateToProps = (state, { node }) => ({
  selectedDriver: selector(state, `${node}.pm_type`)
});

export default connect(mapStateToProps)(injectIntl(RegisterNodeFields));
