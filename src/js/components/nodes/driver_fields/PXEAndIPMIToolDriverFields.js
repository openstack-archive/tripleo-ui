import React from 'react';

import DriverFields from './DriverFields';

export default class PXEAndSSHDriverFields extends DriverFields {
  render() {
    return (
      <DriverFields {...this.props}
                    addr_title="IPMI IP Address"
                    user_title="IPMI Username"
                    pwd_title="IPMI Password" />
    );
  }
}
