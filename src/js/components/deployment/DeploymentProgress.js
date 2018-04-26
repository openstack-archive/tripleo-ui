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
import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ModalBody, ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import {
  getCurrentStack,
  getCurrentStackDeploymentProgress,
  getCreateCompleteResources
} from '../../selectors/stacks';
import { getCurrentPlanDeploymentStatus } from '../../selectors/deployment';
import { InlineLoader } from '../ui/Loader';
import StackResourcesTable from './StackResourcesTable';
import { stackStates } from '../../constants/StacksConstants';

const messages = defineMessages({
  resources: {
    id: 'DeploymentSuccess.resources',
    defaultMessage: 'Resources'
  },
  cancelDeployment: {
    id: 'DeploymentProgress.cancelDeployment',
    defaultMessage: 'Cancel Deployment'
  },
  requestingDeletion: {
    id: 'DeploymentProgress.requestingDeletion',
    defaultMessage: 'Requesting Deletion of Deployment'
  },
  initializingDeployment: {
    id: 'DeploymentProgress.initializingDeployment',
    defaultMessage: 'Initializing {planName} plan deployment'
  },
  deployingPlan: {
    id: 'DeploymentProgress.deployingPlan',
    defaultMessage:
      'Deploying {planName} plan ({completeResourcesCount} of {resourcesCount} resources)'
  },
  configuringPlan: {
    id: 'DeploymentProgress.configuringPlan',
    defaultMessage: 'Configuring {planName} deployment'
  }
});

class DeploymentProgress extends React.Component {
  render() {
    const {
      deploymentStatus: { configDownloadMessage, message },
      planName,
      resourcesCount,
      completeResourcesCount,
      resources,
      resourcesLoaded,
      stackDeploymentProgress,
      stack
    } = this.props;

    return (
      <ModalBody className="flex-container">
        {!stack && (
          <Fragment>
            <div className="progress-description">
              <InlineLoader />
              <FormattedMessage
                {...messages.initializingDeployment}
                values={{ planName: <strong>{planName}</strong> }}
              />
            </div>
            <ProgressBar
              now={0}
              label={<span>0%</span>}
              className="progress-label-top-right"
            />
          </Fragment>
        )}
        {stack &&
          stack.stack_status !== stackStates.CREATE_COMPLETE && (
            <Fragment>
              <div className="progress-description">
                <InlineLoader />
                <FormattedMessage
                  {...messages.deployingPlan}
                  values={{
                    planName: <strong>{planName}</strong>,
                    resourcesCount,
                    completeResourcesCount
                  }}
                />
              </div>
              <ProgressBar
                now={stackDeploymentProgress}
                label={<span>{stackDeploymentProgress + '%'}</span>}
                className="progress-label-top-right"
              />
              {message && <pre>{message}</pre>}
              <h2>
                <FormattedMessage {...messages.resources} />
              </h2>
              <div className="flex-container">
                <div className="flex-column">
                  <StackResourcesTable
                    isFetchingResources={!resourcesLoaded}
                    resources={resources.reverse()}
                  />
                </div>
              </div>
            </Fragment>
          )}
        {stack &&
          stack.stack_status === stackStates.CREATE_COMPLETE && (
            <Fragment>
              <div className="progress-description">
                <InlineLoader />
                <FormattedMessage
                  {...messages.configuringPlan}
                  values={{ planName: <strong>{planName}</strong> }}
                />
              </div>
              <ProgressBar active striped now={100} />
              {message && <pre>{message}</pre>}
              {configDownloadMessage && (
                <div className="flex-container">
                  <pre className="flex-column">{configDownloadMessage}</pre>
                </div>
              )}
            </Fragment>
          )}
      </ModalBody>
    );
  }
}

DeploymentProgress.propTypes = {
  completeResourcesCount: PropTypes.number,
  deploymentStatus: PropTypes.object.isRequired,
  fetchResources: PropTypes.func.isRequired,
  fetchStacks: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingStacks: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  resources: ImmutablePropTypes.list,
  resourcesCount: PropTypes.number,
  resourcesLoaded: PropTypes.bool.isRequired,
  stack: ImmutablePropTypes.record,
  stackDeploymentProgress: PropTypes.number.isRequired
};

const mapStateToProps = (state, props) => ({
  completeResourcesCount: getCreateCompleteResources(state).size,
  stack: getCurrentStack(state),
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  isFetchingStacks: state.stacks.isFetching,
  stackDeploymentProgress: getCurrentStackDeploymentProgress(state),
  resourcesCount: state.stacks.resources.size,
  resources: state.stacks.resources,
  resourcesLoaded: state.stacks.resourcesLoaded
});

const mapDispatchToProps = (dispatch, { planName }) => ({
  deleteStack: () => dispatch(StacksActions.deleteStack(planName, '')),
  fetchStacks: () => dispatch(StacksActions.fetchStacks()),
  fetchResources: (stackName, stackId) =>
    dispatch(StacksActions.fetchResources(stackName, stackId))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentProgress);
