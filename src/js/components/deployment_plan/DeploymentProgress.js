import { FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import { deploymentStatusMessages as statusMessages,
         stackStates } from '../../constants/StacksConstants';
import DeleteStackButton from './DeleteStackButton';
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

    const deleteButton = this.props.stack.stack_status !== stackStates.DELETE_IN_PROGRESS
      ? (<DeleteStackButton content={<FormattedMessage id="cancel-deployment"
                                                        description="Cancel Deployment"
                                                        defaultMessage="Cancel Deployment"/>}
                            buttonIconClass="fa fa-ban"
                            deleteStack={this.props.deleteStack}
                            disabled={this.props.isRequestingStackDelete}
                            loaded={!this.props.isRequestingStackDelete}
                            loaderContent={<FormattedMessage
                                             id="requesting-deletion-of-deployment"
                                             description="Requesting deletion loader"
                                             defaultMessage="Requesting Deletion of Deployment"/>}
                            stack={this.props.stack}/>) : null;

    return (
      <div>
        <p>
          <FormattedMessage id="deployment-is-currently-in-progress"
                            defaultMessage="Deployment is currently in progress."
                            description="Deployment is currently in progress."
          /> <Link to="/deployment-plan/deployment-detail">
            <FormattedMessage id="view-detailed-information"
                              defaultMessage="View detailed information"
                              description="View detailed information link"/>
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
  deleteStack: React.PropTypes.func.isRequired,
  deploymentProgress: React.PropTypes.number.isRequired,
  isRequestingStackDelete: React.PropTypes.bool.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
