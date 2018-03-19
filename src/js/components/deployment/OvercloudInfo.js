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
import React from 'react';

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

const OvercloudInfo = ({ intl, overcloudInfo }) => {
  const ip = overcloudInfo.get('ipAddress');
  const password = overcloudInfo.get('adminPassword');

  // TODO(honza) add SSL

  return (
    <div>
      <h4>
        <FormattedMessage {...messages.overcloudInformationHeader} />
      </h4>
      <Loader
        loaded={!!(ip && password)}
        content={intl.formatMessage(messages.loadingOvercloudInformation)}
      >
        <ul className="list">
          <li>
            <FormattedMessage {...messages.overcloudIpAddress} /> {ip}
          </li>
          <li>
            <FormattedMessage {...messages.username} /> admin
          </li>
          <li>
            <FormattedMessage {...messages.password} /> {password}
          </li>
        </ul>
      </Loader>
      <br />
    </div>
  );
};
OvercloudInfo.propTypes = {
  intl: PropTypes.object,
  overcloudInfo: ImmutablePropTypes.map.isRequired
};

export default injectIntl(OvercloudInfo);
