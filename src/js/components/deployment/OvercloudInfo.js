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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PasswordMask from 'react-password-mask';

import { Loader } from '../ui/Loader';

const messages = defineMessages({
  loadingOvercloudInformation: {
    id: 'OvercloudInfo.loadingOvercloudInformation',
    defaultMessage: 'Loading deployment information...'
  },
  overcloudInformationHeader: {
    id: 'OvercloudInfo.overcloudInformationHeader',
    defaultMessage: 'Deployment Information'
  },
  overcloudIpAddress: {
    id: 'OvercloudInfo.overcloudIpAddress',
    defaultMessage: 'Deployment IP address:'
  },
  password: {
    id: 'OvercloudInfo.password',
    defaultMessage: 'Password:'
  },
  username: {
    id: 'OvercloudInfo.username',
    defaultMessage: 'Username:'
  }
});

class OvercloudInfo extends Component {
  componentDidMount() {
    this.props.fetchOvercloudInfo();
  }

  render() {
    const { intl: { formatMessage }, overcloudInfo } = this.props;
    const ip = overcloudInfo.get('ipAddress');
    const password = overcloudInfo.get('adminPassword');

    // TODO(honza) add SSL

    return (
      <div className="overcloud-info">
        <h4>
          <FormattedMessage {...messages.overcloudInformationHeader} />
        </h4>
        <Loader
          loaded={!!(ip && password)}
          content={formatMessage(messages.loadingOvercloudInformation)}
        >
          <ul className="list">
            <li>
              <FormattedMessage {...messages.overcloudIpAddress} /> {ip}
            </li>
            <li>
              <FormattedMessage {...messages.username} /> admin
            </li>
            <li>
              <div className="password-label">
                <FormattedMessage {...messages.password} />{' '}
              </div>
              <PasswordMask
                buttonClassName={'btn btn-default btn-xs'}
                inputStyles={{ border: 'none', float: 'left' }}
                buttonStyles={{ float: 'left', margin: '1px 5px 0 0' }}
                id="password"
                className="password-mask"
                type="password"
                readOnly
                value={password}
                useVendorStyles={false}
              />
              <CopyToClipboard text={password}>
                <button
                  type="button"
                  id="copy"
                  className="btn btn-default btn-xs"
                  title="Copy to Clipboard"
                >
                  Copy
                </button>
              </CopyToClipboard>
            </li>
          </ul>
        </Loader>
        <br />
      </div>
    );
  }
}
OvercloudInfo.propTypes = {
  fetchOvercloudInfo: PropTypes.func.isRequired,
  intl: PropTypes.object,
  overcloudInfo: ImmutablePropTypes.map.isRequired
};

export default injectIntl(OvercloudInfo);
