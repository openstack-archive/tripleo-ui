/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import {
  deploymentStatusMessages as statusMessages,
  stackStates
} from '../../constants/StacksConstants';
import DeleteStackButton from './DeleteStackButton';
import { InlineLoader } from '../ui/Loader';
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
    const {
      currentPlanName,
      deleteStack,
      intl: { formatMessage },
      isRequestingStackDelete,
      stack
    } = this.props;

    const statusMessage = (
      <strong>
        <FormattedMessage {...statusMessages[stack.stack_status]} />
      </strong>
    );

    const deleteButton = stack.stack_status !== stackStates.DELETE_IN_PROGRESS
      ? <DeleteStackButton
          content={formatMessage(messages.cancelDeployment)}
          buttonIconClass="fa fa-ban"
          deleteStack={deleteStack}
          disabled={isRequestingStackDelete}
          loaded={!isRequestingStackDelete}
          loaderContent={formatMessage(messages.requestingDeletion)}
          stack={stack}
        />
      : null;

    return (
      <div>
        <p>
          <span><FormattedMessage {...messages.deploymentInProgress} /> </span>
          <Link to={`/plans/${currentPlanName}/deployment-detail`}>
            <FormattedMessage {...messages.viewInformation} />
          </Link>
        </p>
        <div className="progress-description">
          <InlineLoader content={statusMessage} />
        </div>
        {this.renderProgressBar()}
        {deleteButton}
      </div>
    );
  }
}

DeploymentProgress.propTypes = {
  currentPlanName: PropTypes.string.isRequired,
  deleteStack: PropTypes.func.isRequired,
  deploymentProgress: PropTypes.number.isRequired,
  intl: PropTypes.object,
  isRequestingStackDelete: PropTypes.bool.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};

export default injectIntl(DeploymentProgress);
