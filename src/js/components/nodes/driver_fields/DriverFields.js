import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import React, { PropTypes } from 'react';

import HorizontalInput from '../../ui/forms/HorizontalInput';
import HorizontalTextarea from '../../ui/forms/HorizontalTextarea';

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

class DriverFields extends React.Component {
  constructor(props) {
    super(props);

    let ip_regex = '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]' +
                   '[0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
    let fqdn_regex = '^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$';

    this.portRegex = '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}' +
                     '|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$$';

    this.ipOrFqdnValidator = {matchRegexp: new RegExp(ip_regex + '|' + fqdn_regex)};
    this.ipOrFqdnValidatorMessage = this.props.intl.formatMessage(
      messages.ipOrFqdnValidatorMessage);


  }

  render() {
    return (
      <div>
        <HorizontalInput
          name="pm_addr"
          title={this.props.addr_title}
          inputColumnClasses="col-sm-7"
          labelColumnClasses="col-sm-5"
          value={this.props.node.pm_addr}
          validations={this.ipOrFqdnValidator}
          validationError={this.ipOrFqdnValidatorMessage}
          required
        />
        <HorizontalInput
          name="pm_port"
          title={this.props.port_title}
          inputColumnClasses="col-sm-7"
          labelColumnClasses="col-sm-5"
          value={this.props.node.pm_port}
          validations={{ matchRegexp: new RegExp(this.portRegex) }}
          validationError={this.props.intl.formatMessage(messages.portValidationMessage)}
        />
        <HorizontalInput
          name="pm_user"
          title={this.props.user_title}
          inputColumnClasses="col-sm-7"
          labelColumnClasses="col-sm-5"
          value={this.props.node.pm_user}
          required
        />
        <HorizontalTextarea
          name="pm_password"
          title={this.props.pwd_title}
          inputColumnClasses="col-sm-7"
          labelColumnClasses="col-sm-5"
          value={this.props.node.pm_password}
          required
        />
      </div>
    );
  }
}
DriverFields.propTypes = {
  addr_title: PropTypes.string.isRequired,
  intl: PropTypes.object,
  node: ImmutablePropTypes.record.isRequired,
  port_title: PropTypes.string.isRequired,
  pwd_title: PropTypes.string.isRequired,
  user_title: PropTypes.string.isRequired
};

export default injectIntl(DriverFields);
