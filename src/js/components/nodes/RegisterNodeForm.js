import Formsy from 'formsy-react';
import React from 'react';

import HorizontalInput from '../ui/forms/HorizontalInput';
import HorizontalArrayInput from '../ui/forms/HorizontalArrayInput';
import HorizontalSelect from '../ui/forms/HorizontalSelect';
import PXEAndSSHDriverFields from './driver_fields/PXEAndSSHDriverFields';
import PXEAndIPMIToolDriverFields from './driver_fields/PXEAndIPMIToolDriverFields';

export default class RegisterNodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.driverOptions = ['pxe_ipmitool', 'pxe_ssh'];

    this.macAddressValidator = {
      matchRegexp:
        /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}(,([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2})*$/
    };
    this.macAddressValidatorMessage = 'Please enter a valid MAC Addresses';
  }

  onNodeFormValidSubmit(formData, resetForm, invalidateForm) {
    let updatedNode = formData;
    updatedNode.id = this.props.selectedNode.id;
    if (this.props.selectedNode.driver !== formData.driver) {
      updatedNode.driver_info = {};
    }
    updatedNode.valid = true;
    this.props.onUpdateNode(updatedNode);
  }

  onNodeFormInvalidSubmit(formData, resetForm, invalidateForm) {
    let updatedNode = formData;
    updatedNode.id = this.props.selectedNode.id;
    if (this.props.selectedNode.driver !== formData.driver) {
      updatedNode.driver_info = {};
    }
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
    switch(this.props.selectedNode.driver) {
    case 'pxe_ipmitool':
      return <PXEAndIPMIToolDriverFields driver_info={this.props.selectedNode.driver_info}/>;
    default:
      return <PXEAndSSHDriverFields driver_info={this.props.selectedNode.driver_info}/>;
    }
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
                             value={this.props.selectedNode.name}/>
          </fieldset>
          <fieldset>
            <legend>Management</legend>
            <HorizontalSelect name="driver"
                              title="Driver"
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-5"
                              value={this.props.selectedNode.driver}
                              options={this.driverOptions} />
            {this.renderDriverFields()}
          </fieldset>
          <fieldset>
            <legend>Networking</legend>
            <HorizontalArrayInput name="nicMacAddresses"
                                  title="NIC MAC Addresses"
                                  inputColumnClasses="col-sm-7"
                                  labelColumnClasses="col-sm-5"
                                  value={this.props.selectedNode.nicMacAddresses.toArray()}
                                  validations={this.macAddressValidator}
                                  validationError={this.macAddressValidatorMessage}
                                  description="Comma separated list of MAC Addresses"
                                  required/>
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
