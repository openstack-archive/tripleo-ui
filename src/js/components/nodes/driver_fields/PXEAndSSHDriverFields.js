import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import HorizontalInput from '../../ui/forms/HorizontalInput';
import HorizontalTextarea from '../../ui/forms/HorizontalTextarea';

export default class PXEAndSSHDriverFields extends React.Component {
  constructor(props) {
    super(props);
    this.sshUserValidator = {
      matchRegexp: /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/
    };
    this.sshUserValidationMessage = `Username must be between 4 and 20 characters
                                     and contain only alphanumeric characters, underscores,
                                     and dots.`;

    this.ipValidator = {
      matchRegexp: new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]' +
                              '[0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
    };
    this.ipValidatorMessage = 'Please enter a valid IPv4 Address';

  }
  render() {
    return (
      <div>
        <HorizontalInput name="pm_addr"
                         title="SSH IP Address"
                         inputColumnClasses="col-sm-7"
                         labelColumnClasses="col-sm-5"
                         value={this.props.node.pm_addr}
                         validations={this.ipValidator}
                         validationError={this.ipValidatorMessage}
                         required />
        <HorizontalInput name="pm_user"
                         title="SSH User"
                         inputColumnClasses="col-sm-7"
                         labelColumnClasses="col-sm-5"
                         value={this.props.node.pm_user}
                         validations={this.sshUserValidator}
                         validationError={this.sshUserValidationMessage}
                         required />
        <HorizontalTextarea name="pm_password"
                            title="SSH Key"
                            inputColumnClasses="col-sm-7"
                            labelColumnClasses="col-sm-5"
                            value={this.props.node.pm_password}
                            required />
      </div>
    );
  }
}
PXEAndSSHDriverFields.propTypes = {
  node: ImmutablePropTypes.record.isRequired
};
