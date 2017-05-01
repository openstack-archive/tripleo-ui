import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import DriverFields from './DriverFields';

const messages = defineMessages({
  addr_title: {
    id: 'PXEAndDRACDriverFields.addr_title',
    defaultMessage: 'DRAC Host'
  },
  user_title: {
    id: 'PXEAndDRACDriverFields.user_title',
    defaultMessage: 'DRAC Username'
  },
  pwd_title: {
    id: 'PXEAndDRACDriverFields.pwd_title',
    defaultMessage: 'DRAC Password'
  }
});

class PXEAndDRACDriverFields extends React.Component {
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

PXEAndDRACDriverFields.propTypes = {
  intl: PropTypes.object
};

export default injectIntl(PXEAndDRACDriverFields);
