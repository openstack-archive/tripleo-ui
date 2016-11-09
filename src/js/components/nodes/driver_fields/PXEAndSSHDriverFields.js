import React from 'react';

import DriverFields from './DriverFields';

export default class PXEAndSSHDriverFields extends React.Component {
  render() {
    return (
      <DriverFields {...this.props}
                    addr_title="SSH IP Address or FQDN"
                    user_title="SSH User"
                    pwd_title="SSH Key" />
    );
  }
}
