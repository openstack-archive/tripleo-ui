import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

import DeleteStackButton from './DeleteStackButton';
import InlineNotification from '../ui/InlineNotification';
import { deploymentStatusMessages } from '../../constants/StacksConstants';

export default class DeploymentFailure extends React.Component {
  render() {
    return (
      <div>
        <InlineNotification type="error"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>
            {this.props.stack.stack_status_reason} <Link to="/deployment-plan/deployment-detail">
            More details</Link>
          </p>
        </InlineNotification>
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

DeploymentFailure.propTypes = {
  deleteStack: React.PropTypes.func.isRequired,
  isRequestingStackDelete: React.PropTypes.bool,
  stack: ImmutablePropTypes.record.isRequired
};
