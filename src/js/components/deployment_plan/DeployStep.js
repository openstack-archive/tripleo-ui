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

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'

import DeploymentSuccess from './DeploymentSuccess'
import DeploymentFailure from './DeploymentFailure'
import DeploymentProgress from './DeploymentProgress'
import Link from '../ui/Link'
import Loader from '../ui/Loader'
import { stackStates } from '../../constants/StacksConstants'

const messages = defineMessages({
  validateAndDeploy: {
    id: 'DeployStep.validateAndDeploy',
    defaultMessage: 'Validate and Deploy'
  },
  requestingDeploy: {
    id: 'DeployStep.requestingDeploy',
    defaultMessage: 'Requesting a deploy...'
  }
})

export const DeployStep = ({
  currentPlan,
  currentStack,
  currentStackResources,
  currentStackDeploymentProgress,
  deleteStack,
  deployPlan,
  fetchStackResource,
  fetchStackEnvironment,
  intl,
  isRequestingStackDelete,
  overcloudInfo,
  stacksLoaded
}) => {
  if (
    !currentStack ||
    currentStack.stack_status === stackStates.DELETE_COMPLETE
  ) {
    return (
      <Loader loaded={stacksLoaded}>
        <Link
          className="link btn btn-primary btn-lg"
          disabled={currentPlan.isRequestingPlanDeploy}
          to={`/plans/${currentPlan.name}/deployment-detail`}
        >
          <Loader
            loaded={!currentPlan.isRequestingPlanDeploy}
            content={intl.formatMessage(messages.requestingDeploy)}
            component="span"
            inline
          >
            <span className="fa fa-cloud-upload" />
            {' '}
            <FormattedMessage {...messages.validateAndDeploy} />
          </Loader>
        </Link>
      </Loader>
    )
  } else if (currentStack.stack_status.match(/PROGRESS/)) {
    return (
      <DeploymentProgress
        currentPlanName={currentPlan.name}
        stack={currentStack}
        isRequestingStackDelete={isRequestingStackDelete}
        deleteStack={deleteStack}
        deploymentProgress={currentStackDeploymentProgress}
      />
    )
  } else if (currentStack.stack_status.match(/COMPLETE/)) {
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
    )
  } else {
    return (
      <DeploymentFailure
        currentPlanName={currentPlan.name}
        deleteStack={deleteStack}
        isRequestingStackDelete={isRequestingStackDelete}
        stack={currentStack}
      />
    )
  }
}

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentProgress: PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  deleteStack: PropTypes.func.isRequired,
  deployPlan: PropTypes.func.isRequired,
  fetchStackEnvironment: PropTypes.func.isRequired,
  fetchStackResource: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isRequestingStackDelete: PropTypes.bool.isRequired,
  overcloudInfo: ImmutablePropTypes.map.isRequired,
  stacksLoaded: PropTypes.bool.isRequired
}

export default injectIntl(DeployStep)
