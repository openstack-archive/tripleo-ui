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
import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ModalBody, ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import {
  getCurrentStack,
  getCurrentStackDeletionProgress
} from '../../selectors/stacks';
import { getCurrentPlanDeploymentStatus } from '../../selectors/deployment';
import { InlineLoader, Loader } from '../ui/Loader';
import StackResourcesTable from './StackResourcesTable';
import { stackStates } from '../../constants/StacksConstants';

const messages = defineMessages({
  resources: {
    id: 'UndeployProgress.resources',
    defaultMessage: 'Resources'
  },
  initializingUndeploy: {
    id: 'UndeployProgress.initializingDeployment',
    defaultMessage: 'Initializing {planName} plan deployment deletion'
  },
  undeployingPlan: {
    id: 'UndeployProgress.undeployingPlan',
    defaultMessage: 'Deleting {planName} plan deployment'
  }
});

class UndeployProgress extends React.Component {
  render() {
    const {
      deploymentStatus: { message },
      planName,
      resources,
      resourcesLoaded,
      stackDeletionProgress,
      stack,
      stacksLoaded
    } = this.props;

    return (
      <ModalBody className="flex-container">
        <Loader
          loaded={stacksLoaded}
          componentProps={{ className: 'flex-container' }}
        >
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
      </ModalBody>
    );
  }
}

UndeployProgress.propTypes = {
  deploymentStatus: PropTypes.object.isRequired,
  intl: PropTypes.object,
  isFetchingStacks: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  resources: ImmutablePropTypes.list,
  resourcesLoaded: PropTypes.bool.isRequired,
  stack: ImmutablePropTypes.record,
  stackDeletionProgress: PropTypes.number.isRequired,
  stacksLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = (state, props) => ({
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  isFetchingStacks: state.stacks.isFetching,
  resources: state.stacks.resources,
  resourcesLoaded: state.stacks.resourcesLoaded,
  stack: getCurrentStack(state),
  stackDeletionProgress: getCurrentStackDeletionProgress(state),
  stacksLoaded: state.stacks.isLoaded
});

export default connect(mapStateToProps)(UndeployProgress);
