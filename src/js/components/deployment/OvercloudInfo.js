import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from '../ui/Loader';

const messages = defineMessages({
  loadingOvercloudInformation: {
    id: 'OvercloudInfo.loadingOvercloudInformation',
    defaultMessage: 'Loading overcloud information...'

  },
  overcloudInformationHeader: {
    id: 'OvercloudInfo.overcloudInformationHeader',
    defaultMessage: 'Overcloud information:'
  },
  overcloudIpAddress: {
    id: 'OvercloudInfo.overcloudIpAddress',
    defaultMessage: 'Overcloud IP address:'
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
  const ip = overcloudInfo ? overcloudInfo.get('ipAddress') : null;
  const password = overcloudInfo ? overcloudInfo.get('adminPassword') : null;

  // TODO(honza) add SSL

  return (
    <div>
      <h4><FormattedMessage {...messages.overcloudInformationHeader}/></h4>
      <Loader loaded={!!overcloudInfo}
              content={intl.formatMessage(messages.loadingOvercloudInformation)}>
        <ul className="list">
          <li><FormattedMessage {...messages.overcloudIpAddress}/> {ip}</li>
          <li><FormattedMessage {...messages.username}/> admin</li>
          <li><FormattedMessage {...messages.password}/> {password}</li>
        </ul>
      </Loader>
      <br />
    </div>
  );
};
OvercloudInfo.propTypes = {
  intl: React.PropTypes.object,
  overcloudInfo: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    ImmutablePropTypes.map
  ]).isRequired
};

export default injectIntl(OvercloudInfo);
