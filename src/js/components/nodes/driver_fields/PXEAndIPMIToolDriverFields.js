import React from 'react';

import DriverFields from './DriverFields';

export default class PXEAndIPMIToolDriverFields extends React.Component {
  render() {
    return (
      <DriverFields {...this.props}
                    addr_title="IPMI IP Address or FQDN"
                    user_title="IPMI Username"
                    pwd_title="IPMI Password" />
    );
  }
}
