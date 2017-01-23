import Formsy from 'formsy-react';
import React from 'react';

import HorizontalInput from '../ui/forms/HorizontalInput';
import HorizontalArrayInput from '../ui/forms/HorizontalArrayInput';
import HorizontalSelect from '../ui/forms/HorizontalSelect';
import PXEAndSSHDriverFields from './driver_fields/PXEAndSSHDriverFields';
import PXEAndIPMIToolDriverFields from './driver_fields/PXEAndIPMIToolDriverFields';
import PXEAndDRACDriverFields from './driver_fields/PXEAndDRACDriverFields';

export default class RegisterNodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.macAddressValidator = {
      matchRegexp:
        /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}(,([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2})*$/
    };
    this.macAddressValidatorMessage = 'Please enter a valid MAC Addresses';
    this.nodeNameValidations = {
      matchRegexp: /^[A-Z0-9-._~]+$/i,
      maxLength: 255
    };
    this.nodeNameValidationErrors = {
      matchRegexp: `Name may only consist of RFC3986 unreserved
                    characters, to wit: ALPHA / DIGIT / "-" / "." / "_" / "~"`,
      maxLength: 'Node name can have up to 255 characters'
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
    switch(this.props.selectedNode.pm_type) {
    case 'pxe_ipmitool':
      return <PXEAndIPMIToolDriverFields node={this.props.selectedNode}/>;
    case 'pxe_drac':
      return <PXEAndDRACDriverFields node={this.props.selectedNode}/>;
    default:
      return <PXEAndSSHDriverFields node={this.props.selectedNode}/>;
    }
  }

  renderDriverOptions() {
    return ['pxe_ipmitool', 'pxe_ssh', 'pxe_drac'].map((value, index) =>
      <option key={index}>{value}</option>
    );
  }

  renderArchitectureOptions() {
    return [undefined, 'x86_64', 'i386'].map((value, index) =>
      <option key={index} value={value}>{value}</option>
    );
  }

  render () {

    return (
      <div>
        <h4>Node Detail</h4>
        <Formsy.Form ref="nodeForm"
                     className="form-horizontal"
                     onValidSubmit={this.onNodeFormValidSubmit.bind(this)}
                     onInvalidSubmit={this.onNodeFormInvalidSubmit.bind(this)}
                     onValid={this.onValid.bind(this)}
                     onInvalid={this.onInvalid.bind(this)}>
          <fieldset>
            <legend>General</legend>
            <HorizontalInput name="name"
                             title="Name"
                             inputColumnClasses="col-sm-7"
                             labelColumnClasses="col-sm-5"
                             validations={this.nodeNameValidations}
                             validationErrors={this.nodeNameValidationErrors}
                             value={this.props.selectedNode.name}/>
          </fieldset>
          <fieldset>
            <legend>Management</legend>
            <HorizontalSelect name="pm_type"
                              title="Driver"
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-5"
                              value={this.props.selectedNode.pm_type}
                              required>
              {this.renderDriverOptions()}
            </HorizontalSelect>
            {this.renderDriverFields()}
          </fieldset>
          <fieldset>
            <legend>Hardware</legend>
            <HorizontalSelect name="arch"
                              title="Architecture"
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-5"
                              value={this.props.selectedNode.arch}>
              {this.renderArchitectureOptions()}
            </HorizontalSelect>
            <HorizontalInput name="cpu"
                             type="number"
                             min={1}
                             title="CPU count"
                             inputColumnClasses="col-sm-7"
                             labelColumnClasses="col-sm-5"
                             value={this.props.selectedNode.cpu}/>
            <HorizontalInput name="memory"
                             type="number"
                             min={1}
                             title="Memory (MB)"
                             inputColumnClasses="col-sm-7"
                             labelColumnClasses="col-sm-5"
                             value={this.props.selectedNode.memory}/>
            <HorizontalInput name="disk"
                             type="number"
                             min={1}
                             title="Disk (GB)"
                             inputColumnClasses="col-sm-7"
                             labelColumnClasses="col-sm-5"
                             value={this.props.selectedNode.disk}/>
          </fieldset>
          <fieldset>
            <legend>Networking</legend>
            <HorizontalArrayInput name="mac"
                                  title="NIC MAC Addresses"
                                  inputColumnClasses="col-sm-7"
                                  labelColumnClasses="col-sm-5"
                                  value={this.props.selectedNode.mac.toArray()}
                                  validations={this.macAddressValidator}
                                  validationError={this.macAddressValidatorMessage}
                                  description="Comma separated list of MAC Addresses"
                                  required />
          </fieldset>
        </Formsy.Form>
      </div>
    );
  }
}
RegisterNodeForm.propTypes = {
  onUpdateNode: React.PropTypes.func,
  selectedNode: React.PropTypes.object
};
