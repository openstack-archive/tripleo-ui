import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import {
  deploymentStatusMessages as statusMessages,
  stackStates
} from '../../constants/StacksConstants';
import DeleteStackButton from './DeleteStackButton';
import Loader from '../ui/Loader';
import ProgressBar from '../ui/ProgressBar';

const messages = defineMessages({
  cancelDeployment: {
    id: 'DeploymentProgress.cancelDeployment',
    defaultMessage: 'Cancel Deployment'
  },
  requestingDeletion: {
    id: 'DeploymentProgress.requestingDeletion',
    defaultMessage: 'Requesting Deletion of Deployment'
  },
  deploymentInProgress: {
    id: 'DeploymentProgress.deploymentInProgress',
    defaultMessage: 'Deployment is currently in progress.'
  },
  viewInformation: {
    id: 'DeploymentProgress.viewInformation',
    defaultMessage: 'View detailed information'
  }
});

class DeploymentProgress extends React.Component {
  renderProgressBar() {
    return this.props.stack.stack_status === stackStates.CREATE_IN_PROGRESS
      ? <ProgressBar
          value={this.props.deploymentProgress}
          label={this.props.deploymentProgress + '%'}
          labelPosition="topRight"
        />
      : null;
  }

  render() {
    const { formatMessage } = this.props.intl;

    const statusMessage = (
      <strong>
        <FormattedMessage {...statusMessages[this.props.stack.stack_status]} />
      </strong>
    );

    const deleteButton = this.props.stack.stack_status !==
      stackStates.DELETE_IN_PROGRESS
      ? <DeleteStackButton
          content={formatMessage(messages.cancelDeployment)}
          buttonIconClass="fa fa-ban"
          deleteStack={this.props.deleteStack}
          disabled={this.props.isRequestingStackDelete}
          loaded={!this.props.isRequestingStackDelete}
          loaderContent={formatMessage(messages.requestingDeletion)}
          stack={this.props.stack}
        />
      : null;

    return (
      <div>
        <p>
          <span><FormattedMessage {...messages.deploymentInProgress} /> </span>
          <Link to="/deployment-plan/deployment-detail">
            <FormattedMessage {...messages.viewInformation} />
          </Link>
        </p>
        <div className="progress-description">
          <Loader loaded={false} content={statusMessage} inline />
        </div>
        {this.renderProgressBar()}
        {deleteButton}
      </div>
    );
  }
}

DeploymentProgress.propTypes = {
  deleteStack: PropTypes.func.isRequired,
  deploymentProgress: PropTypes.number.isRequired,
  intl: PropTypes.object,
  isRequestingStackDelete: PropTypes.bool.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};

export default injectIntl(DeploymentProgress);
