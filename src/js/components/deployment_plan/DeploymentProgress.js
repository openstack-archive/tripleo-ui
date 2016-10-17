import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import React from 'react';
import { Link } from 'react-router';

import { deploymentStatusMessages as statusMessages,
         stackStates } from '../../constants/StacksConstants';
import Loader from '../ui/Loader';
import ProgressBar from '../ui/ProgressBar';

export default class DeploymentProgress extends React.Component {
  renderProgressBar() {
    return (
      this.props.stack.stack_status === stackStates.CREATE_IN_PROGRESS ? (
        <ProgressBar value={this.props.deploymentProgress}
                     label={this.props.deploymentProgress + '%'}
                     labelPosition="topRight"/>
      ) : null
    );
  }

  render() {
    const statusMessage = (
      <strong>{statusMessages[this.props.stack.stack_status]}</strong>
    );

    const deletableStates = new List([
      stackStates.CREATE_IN_PROGRESS,
      stackStates.CREATE_COMPLETE,
      stackStates.CREATE_FAILED,
      stackStates.DELETE_FAILED
    ]);

    const deleteButtonText = this.props.isRequestingDelete
      ? 'Requesting Deployment Deletion'
      : 'Cancel Deployment';

    const deleteButton = deletableStates.includes(this.props.stack.stack_status)
      ? (<Link to="/deployment-plan/deployment-delete"
               type="button"
               className="link btn btn-primary btn-lg">
           {deleteButtonText}
         </Link>) : null;

    return (
      <div>
        <p>
          Deployment is currently in progress. <Link to="/deployment-plan/deployment-detail">
            View detailed information
          </Link>
        </p>
        <div className="progress-description">
          <Loader loaded={false} content={statusMessage} inline/>
        </div>
        {this.renderProgressBar()}
        {deleteButton}
      </div>
    );
  }
}

DeploymentProgress.propTypes = {
  deploymentProgress: React.PropTypes.number.isRequired,
  isRequestingDelete: React.PropTypes.bool.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
