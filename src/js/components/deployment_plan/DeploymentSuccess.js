import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DeleteStackButton from './DeleteStackButton';
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
    const ip = this.props.stackResources.getIn([
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
        <Loader loaded={this.props.stackResourcesLoaded}
                component="p"
                content="Loading overcloud information...">
          <ul>
            <li>Overcloud IP address: <a href={`http://${ip}`}>http://{ip}</a></li>
            <li>Password: {password}</li>
          </ul>
        </Loader>
        <DeleteStackButton content="Delete Deployment"
                           deleteStack={this.props.deleteStack}
                           disabled={this.props.isRequestingStackDelete}
                           loaded={!this.props.isRequestingStackDelete}
                           loaderContent="Requesting Deletion of Deployment"
                           stack={this.props.stack}/>
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  deleteStack: React.PropTypes.func.isRequired,
  fetchStackEnvironment: React.PropTypes.func.isRequired,
  fetchStackResource: React.PropTypes.func.isRequired,
  isRequestingStackDelete: React.PropTypes.bool,
  runPostDeploymentValidations: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: React.PropTypes.bool.isRequired
};
