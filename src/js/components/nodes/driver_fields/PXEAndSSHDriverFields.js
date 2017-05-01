import { defineMessages, injectIntl } from 'react-intl';
import React, { PropTypes } from 'react';

import DriverFields from './DriverFields';

const messages = defineMessages({
  addr_title: {
    id: 'PXEAndSSHDriverFields.addr_title',
    defaultMessage: 'SSH IP Address or FQDN'
  },
  user_title: {
    id: 'PXEAndSSHDriverFields.user_title',
    defaultMessage: 'SSH User'
  },
  pwd_title: {
    id: 'PXEAndSSHDriverFields.pwd_title',
    defaultMessage: 'SSH Key'
  }
});

class PXEAndSSHDriverFields extends React.Component {
  render() {
    return (
      <DriverFields
        {...this.props}
        addr_title={this.props.intl.formatMessage(messages.addr_title)}
        user_title={this.props.intl.formatMessage(messages.user_title)}
        pwd_title={this.props.intl.formatMessage(messages.pwd_title)}
      />
    );
  }
}

PXEAndSSHDriverFields.propTypes = {
  intl: PropTypes.object
};

export default injectIntl(PXEAndSSHDriverFields);
