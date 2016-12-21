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
    defaultMessage: 'Overcloud information'
  },
  overcloudIpAddress: {
    id: 'OvercloudInfo.overcloudIpAddress',
    defaultMessage: 'Overcloud IP address'
  },
  password: {
    id: 'OvercloudInfo.password',
    defaultMessage: 'Password'
  },
  username: {
    id: 'OvercloudInfo.username',
    defaultMessage: 'Username'
  }
});

const OvercloudInfo = ({ intl, stack, stackResources, stackResourcesLoaded }) => {
  const ip = stackResources.getIn([
    'PublicVirtualIP', 'attributes', 'ip_address'
  ]);

  const password = stack.getIn([
    'environment', 'parameter_defaults', 'AdminPassword'
  ]);

  // TODO(honza) add SSL

  return (
    <div>
      <h4><FormattedMessage {...messages.overcloudInformationHeader}/>:</h4>
      <Loader loaded={stackResourcesLoaded}
              content={intl.formatMessage(messages.loadingOvercloudInformation)}>
        <ul className="list">
          <li><FormattedMessage {...messages.overcloudIpAddress}/>: {ip}</li>
          <li><FormattedMessage {...messages.username}/>: admin</li>
          <li><FormattedMessage {...messages.password}/>: {password}</li>
        </ul>
      </Loader>
      <br />
    </div>
  );
};
OvercloudInfo.propTypes = {
  intl: React.PropTypes.object,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: React.PropTypes.bool.isRequired
};

export default injectIntl(OvercloudInfo);
