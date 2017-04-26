import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import DriverFields from './DriverFields';

const messages = defineMessages({
  addr_title: {
    id: 'PXEAndIPMIToolDriverFields.addr_title',
    defaultMessage: 'IPMI IP Address or FQDN'
  },
  user_title: {
    id: 'PXEAndIPMIToolDriverFields.user_title',
    defaultMessage: 'IPMI Username'
  },
  pwd_title: {
    id: 'PXEAndIPMIToolDriverFields.pwd_title',
    defaultMessage: 'IPMI Password'
  }
});

class PXEAndIPMIToolDriverFields extends React.Component {
  render() {
    return (
      <DriverFields {...this.props}
                    addr_title={this.props.intl.formatMessage(messages.addr_title)}
                    user_title={this.props.intl.formatMessage(messages.user_title)}
                    pwd_title={this.props.intl.formatMessage(messages.pwd_title)} />
    );
  }
}

PXEAndIPMIToolDriverFields.propTypes = {
  intl: PropTypes.object
};

export default injectIntl(PXEAndIPMIToolDriverFields);
