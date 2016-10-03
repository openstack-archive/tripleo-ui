import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InlineNotification from '../ui/InlineNotification';
import Loader from '../ui/Loader';
import { deploymentStatusMessages } from '../../constants/StacksConstants';

export default class DeploymentSuccess extends React.Component {
  componentDidMount() {
    this.props.fetchStackResource(this.props.stack, 'PublicVirtualIP');
    this.props.fetchStackEnvironment(this.props.stack);
    this.props.runPostDeploymentValidations();
  }

  render() {
    const loaded = !this.props.stack.resources.isEmpty();
    const ip = this.props.stack.resources.getIn([
      'PublicVirtualIP', 'attributes', 'ip_address'
    ]);

    const password = this.props.stack.getIn([
      'environment', 'parameter_defaults', 'AdminPassword'
    ]);

    // TODO(honza) add SSL

    return (
      <div>
        <InlineNotification type="success"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <h4>Overcloud information:</h4>
        <Loader loaded={loaded} content="Loading overcloud information...">
          <ul>
            <li>Overcloud IP address: <a href={`http://${ip}`}>http://{ip}</a></li>
            <li>Password: {password}</li>
          </ul>
        </Loader>
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  fetchStackEnvironment: React.PropTypes.func.isRequired,
  fetchStackResource: React.PropTypes.func.isRequired,
  runPostDeploymentValidations: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
