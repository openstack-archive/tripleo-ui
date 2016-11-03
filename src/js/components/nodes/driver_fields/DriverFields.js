import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import HorizontalInput from '../../ui/forms/HorizontalInput';
import HorizontalTextarea from '../../ui/forms/HorizontalTextarea';

export default class DriverFields extends React.Component {
  constructor(props) {
    super(props);
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
                         title={this.props.addr_title}
                         inputColumnClasses="col-sm-7"
                         labelColumnClasses="col-sm-5"
                         value={this.props.node.pm_addr}
                         validations={this.ipValidator}
                         validationError={this.ipValidatorMessage}
                         required />
        <HorizontalInput name="pm_user"
                         title={this.props.user_title}
                         inputColumnClasses="col-sm-7"
                         labelColumnClasses="col-sm-5"
                         value={this.props.node.pm_user}
                         required />
        <HorizontalTextarea name="pm_password"
                            title={this.props.pwd_title}
                            inputColumnClasses="col-sm-7"
                            labelColumnClasses="col-sm-5"
                            value={this.props.node.pm_password}
                            required />
      </div>
    );
  }
}
DriverFields.propTypes = {
  addr_title: React.PropTypes.string.isRequired,
  node: ImmutablePropTypes.record.isRequired,
  pwd_title: React.PropTypes.string.isRequired,
  user_title: React.PropTypes.string.isRequired
};
