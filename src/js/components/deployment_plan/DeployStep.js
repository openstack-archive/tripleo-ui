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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import DeploymentProgress from './DeploymentProgress';
import {
  deploymentStates,
  deploymentStatusMessages
} from '../../constants/DeploymentConstants';
import {
  getCurrentPlanDeploymentStatus,
  getCurrentPlanDeploymentStatusUI
} from '../../selectors/deployment';
import { InlineLoader } from '../ui/Loader';
import InlineNotification from '../ui/InlineNotification';

const messages = defineMessages({
  requestingDeploy: {
    id: 'DeployStep.requestingDeploy',
    defaultMessage: 'Requesting a deploy...'
  },
  validateAndDeploy: {
    id: 'DeployStep.validateAndDeploy',
    defaultMessage: 'Validate and Deploy'
  }
});

export const DeployStep = ({
  currentPlan,
  deploymentStatus,
  intl: { formatMessage },
  deploymentStatusUIError
}) => {
  switch (deploymentStatus.status) {
    case deploymentStates.DEPLOYING:
    case deploymentStates.UNDEPLOYING:
      return <DeploymentProgress planName={currentPlan.name} />;
    case deploymentStates.DEPLOY_SUCCESS:
      return <DeploymentSuccess />;
    case deploymentStates.DEPLOY_FAILED:
    case deploymentStates.UNDEPLOY_FAILED:
      return <DeploymentFailure planName={currentPlan.name} />;
    case deploymentStates.UNKNOWN:
      return (
        <InlineNotification
          title={formatMessage(deploymentStatusMessages.UNKNOWN, {
            planName: currentPlan.name
          })}
        >
          {deploymentStatusUIError}
        </InlineNotification>
      );
    default:
      const disabled =
        deploymentStatus.status === deploymentStates.STARTING_DEPLOYMENT;
      return (
        <Link
          to={`/plans/${currentPlan.name}/deployment-confirmation`}
          className="btn btn-primary btn-lg link"
          disabled={disabled}
        >
          <InlineLoader
            loaded={!disabled}
            content={formatMessage(messages.requestingDeploy)}
          >
            <FormattedMessage {...messages.validateAndDeploy} />
          </InlineLoader>
        </Link>
      );
  }
};

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  deploymentStatusUIError: PropTypes.string,
  intl: PropTypes.object
};

const mapStateToProps = (state, props) => ({
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  deploymentStatusUIError: getCurrentPlanDeploymentStatusUI(state).error
});

export default injectIntl(connect(mapStateToProps)(DeployStep));
