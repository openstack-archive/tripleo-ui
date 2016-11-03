import React from 'react';

import DriverFields from './DriverFields';

export default class PXEAndSSHDriverFields extends DriverFields {
  render() {
    return (
      <DriverFields {...this.props}
                    addr_title="SSH IP Address"
                    user_title="SSH User"
                    pwd_title="SSH Key" />
    );
  }
}
