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
import { ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { deploymentStatusMessages } from '../../constants/DeploymentConstants';
import { stackStates } from '../../constants/StacksConstants';
import { getCurrentPlanDeploymentStatus } from '../../selectors/deployment';
import {
  getCurrentStack,
  getCurrentStackDeploymentProgress,
  getCreateCompleteResources
} from '../../selectors/stacks';
import { InlineLoader } from '../ui/Loader';
import StacksActions from '../../actions/StacksActions';

const messages = defineMessages({
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
  },
  viewInformation: {
    id: 'DeploymentProgress.viewInformation',
    defaultMessage: 'View detailed information'
  }
});

class DeploymentProgress extends React.Component {
  componentDidMount() {
    this.fetchStacks();
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.stack && newProps.stack) {
      const { stack: { stack_name, id } } = newProps;
      this.props.fetchResources(stack_name, id);
    }
  }

  fetchStacks() {
    const { fetchStacks, isFetchingStacks } = this.props;
    !isFetchingStacks && fetchStacks();
  }

  render() {
    const {
      deploymentStatus: { status, message },
      planName,
      resourcesCount,
      completeResourcesCount,
      stackDeploymentProgress,
      stack
    } = this.props;

    return (
      <div>
        <p>
          <span>
            <FormattedMessage
              {...deploymentStatusMessages[status]}
              values={{ planName: <strong>{planName}</strong> }}
            />
          </span>{' '}
          <Link to={`/plans/${planName}/deployment-detail`}>
            <FormattedMessage {...messages.viewInformation} />
          </Link>
        </p>
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
            </Fragment>
          )}
      </div>
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
  resourcesCount: PropTypes.number,
  stack: ImmutablePropTypes.record,
  stackDeploymentProgress: PropTypes.number.isRequired
};

const mapStateToProps = (state, props) => ({
  completeResourcesCount: getCreateCompleteResources(state).size,
  stack: getCurrentStack(state),
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  isFetchingStacks: state.stacks.isFetching,
  stackDeploymentProgress: getCurrentStackDeploymentProgress(state),
  resourcesCount: state.stacks.resources.size
});

const mapDispatchToProps = (dispatch, { planName }) => ({
  deleteStack: () => dispatch(StacksActions.deleteStack(planName, '')),
  fetchStacks: () => dispatch(StacksActions.fetchStacks()),
  fetchResources: (stackName, stackId) =>
    dispatch(StacksActions.fetchResources(stackName, stackId))
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentProgress)
);
