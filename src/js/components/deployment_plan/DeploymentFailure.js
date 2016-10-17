import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

import InlineNotification from '../ui/InlineNotification';
import { deploymentStatusMessages } from '../../constants/StacksConstants';

export default class DeploymentFailure extends React.Component {
  render() {
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
        <InlineNotification type="error"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>
            {this.props.stack.stack_status_reason} <Link to="/deployment-plan/deployment-detail">
            More details</Link>
          </p>
        </InlineNotification>
        {deleteButton}
      </div>
    );
  }
}

DeploymentFailure.propTypes = {
  isRequestingDelete: React.PropTypes.bool,
  stack: ImmutablePropTypes.record.isRequired
};
