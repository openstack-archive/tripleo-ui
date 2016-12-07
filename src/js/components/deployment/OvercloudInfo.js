import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from '../ui/Loader';

const OvercloudInfo = ({ overcloudInfo }) => {
  const ip = overcloudInfo ? overcloudInfo.get('ipAddress') : null;
  const password = overcloudInfo ? overcloudInfo.get('adminPassword') : null;

  // TODO(honza) add SSL

  return (
    <div>
      <h4>Overcloud information:</h4>
      <Loader loaded={!!overcloudInfo}
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
  overcloudInfo: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    ImmutablePropTypes.map
  ]).isRequired
};

export default OvercloudInfo;
