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
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import DeploymentProgress from './DeploymentProgress';
import { deploymentStates } from '../../constants/DeploymentConstants';
import Link from '../ui/Link';
import { InlineLoader, Loader } from '../ui/Loader';
import { stackStates } from '../../constants/StacksConstants';

const messages = defineMessages({
  validateAndDeploy: {
    id: 'DeployStep.validateAndDeploy',
    defaultMessage: 'Validate and Deploy'
  },
  requestingDeploy: {
    id: 'DeployStep.requestingDeploy',
    defaultMessage: 'Requesting a deploy...'
  }
});

export const DeployStep = ({
  currentPlan,
  deploymentStatus,
  // currentStack,
  // currentStackResources,
  // currentStackDeploymentProgress,
  // deleteStack,
  // deployPlan,
  // fetchStackResource,
  // fetchStackEnvironment,
  intl
  // isRequestingStackDelete,
  // overcloudInfo,
  // stacksLoaded
}) => {
  switch (deploymentStatus.status) {
    case deploymentStates.DEPLOYING:
    case deploymentStates.UNDEPLOYING:
      return (
        <DeploymentProgress
          currentPlanName={currentPlan.name}
          stack={currentStack}
          isRequestingStackDelete={isRequestingStackDelete}
          deleteStack={deleteStack}
          deploymentProgress={currentStackDeploymentProgress}
        />
      );
    case deploymentStates.DEPLOYED:
      return (
        <DeploymentSuccess
          stack={currentStack}
          stackResources={currentStackResources}
          isRequestingStackDelete={isRequestingStackDelete}
          overcloudInfo={overcloudInfo}
          deleteStack={deleteStack}
          fetchStackResource={fetchStackResource}
          fetchStackEnvironment={fetchStackEnvironment}
        />
      );
    case deploymentStates.DEPLOYMENT_FAILED:
      return (
        <div>
          {deploymentStatus.status}
          {deploymentStatus.message}
        </div>
      );
    // return (
    //   <DeploymentFailure
    //     currentPlanName={currentPlan.name}
    //     deleteStack={deleteStack}
    //     isRequestingStackDelete={isRequestingStackDelete}
    //     stack={currentStack}
    //   />
    // );
    case deploymentStates.UNDEPLOY_FAILED:
      // we may not want to store the message in case the undeploy fails
      // so we can get back to previous state
      return 'undeploy failed';
    default:
      // UNDEPLOYED
      return (
        <Link
          className="link btn btn-primary btn-lg"
          disabled={currentPlan.isRequestingPlanDeploy}
          to={`/plans/${currentPlan.name}/deployment-detail`}
        >
          <InlineLoader
            loaded={!currentPlan.isRequestingPlanDeploy}
            content={intl.formatMessage(messages.requestingDeploy)}
          >
            <FormattedMessage {...messages.validateAndDeploy} />
          </InlineLoader>
        </Link>
      );
  }
};

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  // currentStack: ImmutablePropTypes.record,
  // currentStackDeploymentProgress: PropTypes.number.isRequired,
  // currentStackResources: ImmutablePropTypes.map,
  // deleteStack: PropTypes.func.isRequired,
  // deployPlan: PropTypes.func.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  // fetchStackEnvironment: PropTypes.func.isRequired,
  // fetchStackResource: PropTypes.func.isRequired,
  intl: PropTypes.object
  // isRequestingStackDelete: PropTypes.bool.isRequired,
  // overcloudInfo: ImmutablePropTypes.map.isRequired,
  // stacksLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = (dispatch, props) => ({});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeployStep)
);
