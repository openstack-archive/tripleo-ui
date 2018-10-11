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
import { injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import DeleteStackButton from './DeleteStackButton';
import { deploymentStatusMessages } from '../../constants/DeploymentConstants';
import {
  getCurrentPlanDeploymentStatus,
  getCurrentPlanDeploymentStatusUI
} from '../../selectors/deployment';
import { getCurrentStack, getOvercloudInfo } from '../../selectors/stacks';
import { getCurrentPlanName } from '../../selectors/plans';
import InlineNotification from '../ui/InlineNotification';
import OvercloudInfo from '../deployment/OvercloudInfo';
import { Loader } from '../ui/Loader';
import { startUndeploy } from '../../actions/DeploymentActions';
import {
  fetchStacks,
  fetchEnvironment,
  fetchResource
} from '../../actions/StacksActions';

class DeploymentSuccess extends React.Component {
  componentDidMount() {
    this.props.fetchStacks();
  }

  fetchOvercloudInfo() {
    const { fetchStackEnvironment, fetchStackResource, stack } = this.props;
    fetchStackResource(stack, 'PublicVirtualIP');
    fetchStackEnvironment(stack);
  }

  render() {
    const {
      intl: { formatMessage },
      isPendingRequest,
      stack,
      stacksLoaded,
      overcloudInfo,
      planName,
      undeployPlan,
      deploymentStatus: { status, message }
    } = this.props;

    return (
      <Loader loaded={stacksLoaded}>
        <InlineNotification
          type="success"
          title={formatMessage(deploymentStatusMessages[status])}
        >
          <p>{message}</p>
        </InlineNotification>

        {stack && (
          <Fragment>
            <OvercloudInfo
              overcloudInfo={overcloudInfo}
              fetchOvercloudInfo={this.fetchOvercloudInfo.bind(this)}
            />
            <DeleteStackButton
              deleteStack={undeployPlan.bind(this, planName)}
              disabled={isPendingRequest}
            />
          </Fragment>
        )}
      </Loader>
    );
  }
}

DeploymentSuccess.propTypes = {
  deploymentStatus: ImmutablePropTypes.record.isRequired,
  fetchStackEnvironment: PropTypes.func.isRequired,
  fetchStackResource: PropTypes.func.isRequired,
  fetchStacks: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isPendingRequest: PropTypes.bool.isRequired,
  overcloudInfo: ImmutablePropTypes.map.isRequired,
  planName: PropTypes.string.isRequired,
  stack: ImmutablePropTypes.record,
  stacksLoaded: PropTypes.bool.isRequired,
  undeployPlan: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  planName: getCurrentPlanName(state),
  overcloudInfo: getOvercloudInfo(state),
  stack: getCurrentStack(state),
  stacksLoaded: state.stacks.isLoaded,
  isPendingRequest: getCurrentPlanDeploymentStatusUI(state).isPendingRequest
});

const mapDispatchToProps = dispatch => ({
  undeployPlan: planName => dispatch(startUndeploy(planName)),
  fetchStacks: () => dispatch(fetchStacks()),
  fetchStackEnvironment: stack => dispatch(fetchEnvironment(stack)),
  fetchStackResource: (stack, resourceName) =>
    dispatch(fetchResource(stack, resourceName))
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentSuccess)
);
