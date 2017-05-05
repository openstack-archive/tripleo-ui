/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { defineMessages, injectIntl } from 'react-intl';
import React, { PropTypes } from 'react';

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
