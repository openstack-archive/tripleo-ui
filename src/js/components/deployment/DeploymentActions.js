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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RedeployPlanButton from './RedeployPlanButton';
import DeleteDeploymentButton from './DeleteDeploymentButton';
import RecoverDeploymentStatusButton from './RecoverDeploymentStatusButton';
import { getCurrentPlanName } from '../../selectors/plans';
import { getCurrentPlanDeploymentStatusUI } from '../../selectors/deployment';
import {
  recoverDeploymentStatus,
  startDeployment,
  startUndeploy
} from '../../actions/DeploymentActions';
import {
  REDEPLOY,
  UNDEPLOY,
  RECOVER_STATUS
} from '../../constants/DeploymentActionsConstants';

class DeploymentActions extends Component {
  render() {
    const {
      actions,
      currentPlanName,
      recoverDeploymentStatus,
      startDeployment,
      startUndeploy,
      isPendingDeployment,
      isPendingRecoverStatus,
      isPendingUndeploy
    } = this.props;
    const isPending =
      isPendingDeployment || isPendingUndeploy || isPendingRecoverStatus;
    return (
      <div>
        {actions.includes(REDEPLOY) && (
          <RedeployPlanButton
            startDeployment={() => startDeployment(currentPlanName)}
            isPending={isPendingDeployment}
            disabled={isPending}
          />
        )}{' '}
        {actions.includes(UNDEPLOY) && (
          <DeleteDeploymentButton
            deleteDeployment={() => startUndeploy(currentPlanName)}
            isPending={isPendingUndeploy}
            disabled={isPending}
          />
        )}{' '}
        {actions.includes(RECOVER_STATUS) && (
          <RecoverDeploymentStatusButton
            recoverDeploymentStatus={() =>
              recoverDeploymentStatus(currentPlanName)
            }
            isPending={isPendingRecoverStatus}
            disabled={isPending}
          />
        )}{' '}
      </div>
    );
  }
}
DeploymentActions.propTypes = {
  actions: PropTypes.array.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  isPendingDeployment: PropTypes.bool.isRequired,
  isPendingRecoverStatus: PropTypes.bool.isRequired,
  isPendingUndeploy: PropTypes.bool.isRequired,
  recoverDeploymentStatus: PropTypes.func.isRequired,
  startDeployment: PropTypes.func.isRequired,
  startUndeploy: PropTypes.func.isRequired
};
DeploymentActions.defaultProps = {
  actions: []
};

const mapStateToProps = state => ({
  currentPlanName: getCurrentPlanName(state),
  isPendingDeployment: getCurrentPlanDeploymentStatusUI(state)
    .isPendingDeployment,
  isPendingRecoverStatus: getCurrentPlanDeploymentStatusUI(state)
    .isPendingRecoverStatus,
  isPendingUndeploy: getCurrentPlanDeploymentStatusUI(state).isPendingUndeploy
});

export default connect(mapStateToProps, {
  recoverDeploymentStatus,
  startDeployment,
  startUndeploy
})(DeploymentActions);
