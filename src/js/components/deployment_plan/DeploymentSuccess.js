import { FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import DeleteStackButton from './DeleteStackButton';
import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import OvercloudInfo from '../deployment/OvercloudInfo';

export default class DeploymentSuccess extends React.Component {
  componentDidMount() {
    this.props.fetchStackResource(this.props.stack, 'PublicVirtualIP');
    this.props.fetchStackEnvironment(this.props.stack);
    this.props.runPostDeploymentValidations();
  }

  render() {
    return (
      <div>
        <InlineNotification type="success"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <OvercloudInfo stackResourcesLoaded={this.props.stackResourcesLoaded}
                       stack={this.props.stack}
                       stackResources={this.props.stackResources}/>
        <DeleteStackButton content={<FormattedMessage id="delete-deployment"
                                                      description="Delete deployment button"
                                                      defaultMessage="Delete Deployment"/>}
                           deleteStack={this.props.deleteStack}
                           disabled={this.props.isRequestingStackDelete}
                           loaded={!this.props.isRequestingStackDelete}
                           loaderContent={<FormattedMessage
                                            id="requesting-deletion-of-deployment"
                                            description="Requesting Deletion Loader"
                                            defaultMessage="Requesting Deletion of Deployment"/>}
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
