/**
 * Copyright 2018 Red Hat Inc.
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
  getCurrentStackDeletionProgress,
  getDeleteCompleteResources
} from '../../selectors/stacks';
import { InlineLoader, Loader } from '../ui/Loader';
import StacksActions from '../../actions/StacksActions';

const messages = defineMessages({
  initializingUndeploy: {
    id: 'UndeployProgress.initializingUndeploy',
    defaultMessage: 'Initializing {planName} plan deployment deletion'
  },
  viewInformation: {
    id: 'UndeployProgress.viewInformation',
    defaultMessage: 'View detailed information'
  },
  undeployingPlan: {
    id: 'UndeployProgress.undeployingPlan',
    defaultMessage: 'Deleting {planName} plan deployment'
  }
});

class UndeployProgress extends React.Component {
  componentDidMount() {
    this.fetchStacks();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.stack && this.props.stack) {
      const { stack: { stack_name, id }, fetchResources } = this.props;
      fetchResources(stack_name, id);
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
      deletedResourcesCount,
      stackDeletionProgress,
      stack,
      stacksLoaded
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
        <Loader loaded={stacksLoaded}>
          {stack &&
            stack.stack_status !== stackStates.DELETE_IN_PROGRESS && (
              <Fragment>
                <div className="progress-description">
                  <InlineLoader />
                  <FormattedMessage
                    {...messages.initializingUndeploy}
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
            stack.stack_status === stackStates.DELETE_IN_PROGRESS && (
              <Fragment>
                <div className="progress-description">
                  <InlineLoader />
                  <FormattedMessage
                    {...messages.undeployingPlan}
                    values={{ planName: <strong>{planName}</strong> }}
                  />
                </div>
                <ProgressBar
                  bsStyle="danger"
                  now={stackDeletionProgress}
                  label={<span>{stackDeletionProgress + '%'}</span>}
                  className="progress-label-top-right"
                />
                {message && <pre>{message}</pre>}
              </Fragment>
            )}
          {!stack && (
            <Fragment>
              <div className="progress-description">
                <InlineLoader />
                <FormattedMessage
                  {...messages.undeployingPlan}
                  values={{ planName: <strong>{planName}</strong> }}
                />
              </div>
              <ProgressBar
                bsStyle="danger"
                now={100}
                label={<span>{100 + '%'}</span>}
                className="progress-label-top-right"
              />
              {message && <pre>{message}</pre>}
            </Fragment>
          )}
        </Loader>
      </div>
    );
  }
}

UndeployProgress.propTypes = {
  deletedResourcesCount: PropTypes.number,
  deploymentStatus: PropTypes.object.isRequired,
  fetchResources: PropTypes.func.isRequired,
  fetchStacks: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingStacks: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  resourcesCount: PropTypes.number,
  stack: ImmutablePropTypes.record,
  stackDeletionProgress: PropTypes.number.isRequired,
  stacksLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = (state, props) => ({
  deletedResourcesCount: getDeleteCompleteResources(state).size,
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  isFetchingStacks: state.stacks.isFetching,
  stack: getCurrentStack(state),
  stacksLoaded: state.stacks.isLoaded,
  stackDeletionProgress: getCurrentStackDeletionProgress(state),
  resourcesCount: state.stacks.resources.size
});

const mapDispatchToProps = (dispatch, { planName }) => ({
  fetchStacks: () => dispatch(StacksActions.fetchStacks()),
  fetchResources: (stackName, stackId) =>
    dispatch(StacksActions.fetchResources(stackName, stackId))
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(UndeployProgress)
);
