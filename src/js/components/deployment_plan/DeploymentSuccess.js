import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

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

    const deleteButtonText = this.props.isRequestingDelete
      ? 'Requesting Deployment Deletion'
      : 'Delete Deployment';

    const deleteButton = (
      <Link to="/deployment-plan/deployment-delete"
            type="button"
            className="link btn btn-primary btn-lg">
        {deleteButtonText}
      </Link>
    );

    return (
      <div>
        <InlineNotification type="success"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <h4>Overcloud information:</h4>
        <Loader loaded={this.props.stackResourcesLoaded}
                content="Loading overcloud information...">
          <ul>
            <li>Overcloud IP address: <a href={`http://${ip}`}>http://{ip}</a></li>
            <li>Password: {password}</li>
          </ul>
        </Loader>
        {deleteButton}
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  fetchStackEnvironment: React.PropTypes.func.isRequired,
  fetchStackResource: React.PropTypes.func.isRequired,
  isRequestingDelete: React.PropTypes.bool,
  runPostDeploymentValidations: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: React.PropTypes.bool.isRequired
};
