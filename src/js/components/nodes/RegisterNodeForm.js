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

import Formsy from 'formsy-react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalInput from '../ui/forms/HorizontalInput';
import HorizontalArrayInput from '../ui/forms/HorizontalArrayInput';
import HorizontalSelect from '../ui/forms/HorizontalSelect';
import PXEAndSSHDriverFields from './driver_fields/PXEAndSSHDriverFields';
import PXEAndIPMIToolDriverFields
  from './driver_fields/PXEAndIPMIToolDriverFields';
import PXEAndDRACDriverFields from './driver_fields/PXEAndDRACDriverFields';

const messages = defineMessages({
  enterValidMacAddress: {
    id: 'RegisterNodeForm.enterValidMacAddress',
    defaultMessage: 'Please enter a valid MAC Address.'
  },
  nodeNameRegexp: {
    id: 'RegisterNodeForm.nodeNameRegexp',
    defaultMessage: 'Name may only consist of RFC3986 unreserved characters, to wit: ' +
      'ALPHA / DIGIT / "-" / "." / "_" / "~".'
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
    defaultMessage: 'Comma separated list of MAC Addresses'
  }
});

class RegisterNodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.macAddressValidator = {
      matchRegexp: /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}(,([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2})*$/
    };
    this.macAddressValidatorMessage = this.props.intl.formatMessage(
      messages.enterValidMacAddress
    );
    this.nodeNameValidations = {
      matchRegexp: /^[A-Z0-9-._~]+$/i,
      maxLength: 255
    };
    this.nodeNameValidationErrors = {
      matchRegexp: this.props.intl.formatMessage(messages.nodeNameRegexp),
      maxLength: this.props.intl.formatMessage(messages.nodeNameMaxLength)
    };
  }

  onNodeFormValidSubmit(formData, resetForm, invalidateForm) {
    let updatedNode = formData;
    updatedNode.uuid = this.props.selectedNode.uuid;
    updatedNode.valid = true;
    this.props.onUpdateNode(updatedNode);
  }

  onNodeFormInvalidSubmit(formData, resetForm, invalidateForm) {
    let updatedNode = formData;
    updatedNode.uuid = this.props.selectedNode.uuid;
    updatedNode.valid = false;
    this.props.onUpdateNode(updatedNode);
  }

  onValid() {
    this.refs.nodeForm.submit();
  }

  onInvalid() {
    this.refs.nodeForm.submit();
  }

  renderDriverFields() {
    switch (this.props.selectedNode.pm_type) {
      case 'pxe_ipmitool':
        return <PXEAndIPMIToolDriverFields node={this.props.selectedNode} />;
      case 'pxe_drac':
        return <PXEAndDRACDriverFields node={this.props.selectedNode} />;
      default:
        return <PXEAndSSHDriverFields node={this.props.selectedNode} />;
    }
  }

  renderDriverOptions() {
    return ['pxe_ipmitool', 'pxe_ssh', 'pxe_drac'].map((value, index) => (
      <option key={index}>{value}</option>
    ));
  }

  renderArchitectureOptions() {
    return [undefined, 'x86_64', 'i386'].map((value, index) => (
      <option key={index} value={value}>{value}</option>
    ));
  }

  render() {
    return (
      <div>
        <h4><FormattedMessage {...messages.nodeDetail} /></h4>
        <Formsy.Form
          ref="nodeForm"
          className="form-horizontal"
          onValidSubmit={this.onNodeFormValidSubmit.bind(this)}
          onInvalidSubmit={this.onNodeFormInvalidSubmit.bind(this)}
          onValid={this.onValid.bind(this)}
          onInvalid={this.onInvalid.bind(this)}
        >
          <fieldset>
            <legend><FormattedMessage {...messages.general} /></legend>
            <HorizontalInput
              name="name"
              title={this.props.intl.formatMessage(messages.name)}
              inputColumnClasses="col-sm-7"
              labelColumnClasses="col-sm-5"
              validations={this.nodeNameValidations}
              validationErrors={this.nodeNameValidationErrors}
              value={this.props.selectedNode.name}
            />
          </fieldset>
          <fieldset>
            <legend><FormattedMessage {...messages.management} /></legend>
            <HorizontalSelect
              name="pm_type"
              title={this.props.intl.formatMessage(messages.driver)}
              inputColumnClasses="col-sm-7"
              labelColumnClasses="col-sm-5"
              value={this.props.selectedNode.pm_type}
              required
            >
              {this.renderDriverOptions()}
            </HorizontalSelect>
            {this.renderDriverFields()}
          </fieldset>
          <fieldset>
            <legend><FormattedMessage {...messages.hardware} /></legend>
            <HorizontalSelect
              name="arch"
              title={this.props.intl.formatMessage(messages.architecture)}
              inputColumnClasses="col-sm-7"
              labelColumnClasses="col-sm-5"
              value={this.props.selectedNode.arch}
            >
              {this.renderArchitectureOptions()}
            </HorizontalSelect>
            <HorizontalInput
              name="cpu"
              type="number"
              min={1}
              title={this.props.intl.formatMessage(messages.cpuCount)}
              inputColumnClasses="col-sm-7"
              labelColumnClasses="col-sm-5"
              value={this.props.selectedNode.cpu}
            />
            <HorizontalInput
              name="memory"
              type="number"
              min={1}
              title={this.props.intl.formatMessage(messages.memoryMb)}
              inputColumnClasses="col-sm-7"
              labelColumnClasses="col-sm-5"
              value={this.props.selectedNode.memory}
            />
            <HorizontalInput
              name="disk"
              type="number"
              min={1}
              title={this.props.intl.formatMessage(messages.diskGb)}
              inputColumnClasses="col-sm-7"
              labelColumnClasses="col-sm-5"
              value={this.props.selectedNode.disk}
            />
          </fieldset>
          <fieldset>
            <legend><FormattedMessage {...messages.networking} /></legend>
            <HorizontalArrayInput
              name="mac"
              title={this.props.intl.formatMessage(messages.nicMacAddresses)}
              inputColumnClasses="col-sm-7"
              labelColumnClasses="col-sm-5"
              value={this.props.selectedNode.mac.toArray()}
              validations={this.macAddressValidator}
              validationError={this.macAddressValidatorMessage}
              description={this.props.intl.formatMessage(
                messages.macAddressesDescription
              )}
              required
            />
          </fieldset>
        </Formsy.Form>
      </div>
    );
  }
}
RegisterNodeForm.propTypes = {
  intl: PropTypes.object,
  onUpdateNode: PropTypes.func,
  selectedNode: PropTypes.object
};

export default injectIntl(RegisterNodeForm);
