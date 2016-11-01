import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from '../ui/Loader';

const OvercloudInfo = ({ stack, stackResources, stackResourcesLoaded }) => {
  const ip = stackResources.getIn([
    'PublicVirtualIP', 'attributes', 'ip_address'
  ]);

  const password = stack.getIn([
    'environment', 'parameter_defaults', 'AdminPassword'
  ]);

  // TODO(honza) add SSL

  return (
    <div>
      <h4>Overcloud information:</h4>
      <Loader loaded={stackResourcesLoaded}
              content="Loading overcloud information...">
        <ul className="list">
          <li>Overcloud IP address: {ip}</li>
          <li>Username: admin</li>
          <li>Password: {password}</li>
        </ul>
      </Loader>
      <br />
    </div>
  );
};
OvercloudInfo.propTypes = {
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: React.PropTypes.bool.isRequired
};

export default OvercloudInfo;
