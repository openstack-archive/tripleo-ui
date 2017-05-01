import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';

import DeleteStackButton from './DeleteStackButton';
import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import OvercloudInfo from '../deployment/OvercloudInfo';

const messages = defineMessages({
  deleteDeployment: {
    id: 'DeploymentSuccess.deleteDeployment',
    defaultMessage: 'Delete Deployment'
  },
  requestingDeletion: {
    id: 'DeploymentSuccess.requestingDeletion',
    defaultMessage: 'Requesting Deletion of Deployment'
  }
});

class DeploymentSuccess extends React.Component {
  componentDidMount() {
    this.props.fetchStackResource(this.props.stack, 'PublicVirtualIP');
    this.props.fetchStackEnvironment(this.props.stack);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const status = formatMessage(
      deploymentStatusMessages[this.props.stack.stack_status]
    );

    return (
      <div>
        <InlineNotification type="success" title={status}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <OvercloudInfo
          stackResourcesLoaded={this.props.stackResourcesLoaded}
          stack={this.props.stack}
          stackResources={this.props.stackResources}
        />
        <DeleteStackButton
          content={formatMessage(messages.deleteDeployment)}
          deleteStack={this.props.deleteStack}
          disabled={this.props.isRequestingStackDelete}
          loaded={!this.props.isRequestingStackDelete}
          loaderContent={formatMessage(messages.requestingDeletion)}
          stack={this.props.stack}
        />
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  deleteStack: PropTypes.func.isRequired,
  fetchStackEnvironment: PropTypes.func.isRequired,
  fetchStackResource: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isRequestingStackDelete: PropTypes.bool,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: PropTypes.bool.isRequired
};

export default injectIntl(DeploymentSuccess);
