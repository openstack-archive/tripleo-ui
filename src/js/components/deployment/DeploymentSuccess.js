import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from '../ui/Loader';
import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';

export default class DeploymentSuccess extends React.Component {
  render() {
    const ip = this.props.stackResources.getIn([
      'PublicVirtualIP', 'attributes', 'ip_address'
    ]);

    const password = this.props.stack.getIn([
      'environment', 'parameter_defaults', 'AdminPassword'
    ]);

    return (
      <div className="col-sm-12 fixed-container-body-content">
        <InlineNotification type="success"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <h4>Overcloud information:</h4>
        <Loader loaded={this.props.stackResourcesLoaded}
                content="Loading overcloud information...">
          <ul className="list">
            <li>Overcloud IP address: {ip}</li>
            <li>Username: admin</li>
            <li>Password: {password}</li>
          </ul>
        </Loader>
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: React.PropTypes.bool.isRequired
};
