import React from 'react';

import DriverFields from './DriverFields';

export default class PXEAndDRACDriverFields extends React.Component {
  render() {
    return (
      <DriverFields {...this.props}
                    addr_title="DRAC Host"
                    user_title="DRAC Username"
                    pwd_title="DRAC Password" />
    );
  }
}
