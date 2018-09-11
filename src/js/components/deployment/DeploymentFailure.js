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
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import DeleteStackButton from '../deployment_plan/DeleteStackButton';
import RecoverDeploymentStatusButton from './RecoverDeploymentStatusButton';
import DeploymentFailures from './DeploymentFailures';
import { deploymentStatusMessages } from '../../constants/DeploymentConstants';
import { stackStates } from '../../constants/StacksConstants';
import { getCurrentStack } from '../../selectors/stacks';
import {
  getCurrentPlanDeploymentStatus,
  getCurrentPlanDeploymentStatusUI
} from '../../selectors/deployment';
import InlineNotification from '../ui/InlineNotification';
import { Loader } from '../ui/Loader';
import { sanitizeMessage } from '../../utils';
import { fetchStacks } from '../../actions/StacksActions';
import { startUndeploy } from '../../actions/DeploymentActions';
import StackResources from './StackResources';

const messages = defineMessages({
  fetchingStack: {
    id: 'DeploymentFailure.fetchingStack',
    defaultMessage: 'Loading deployment information...'
  }
});

class DeploymentFailure extends React.Component {
  componentDidMount() {
    const { fetchStacks, isFetchingStacks } = this.props;
    !isFetchingStacks && fetchStacks();
  }

  render() {
    const {
      deploymentStatus: { status, message },
      undeployPlan,
      intl: { formatMessage },
      isFetchingStacks,
      isPendingRequest,
      planName,
      stack
    } = this.props;

    return (
      <ModalBody className="flex-container">
        <div className="page-header">
          <div className="pull-right">
            {isFetchingStacks ||
              (stack && (
                <DeleteStackButton
                  deleteStack={() => undeployPlan()}
                  disabled={isPendingRequest}
                />
              ))}
            {isFetchingStacks || (!stack && <RecoverDeploymentStatusButton />)}
          </div>
          <h2>
            <FormattedMessage
              {...deploymentStatusMessages[status]}
              values={{ planName }}
            />
          </h2>
        </div>
        <InlineNotification type="error">
          <p>{sanitizeMessage(message)}</p>
        </InlineNotification>
        <div className="flex-column">
          <Loader
            loaded={!isFetchingStacks}
            content={formatMessage(messages.fetchingStack)}
          >
            {stack &&
              ([
                stackStates.CREATE_COMPLETE,
                stackStates.UPDATE_COMPLETE
              ].includes(stack.stack_status) ? (
                <DeploymentFailures />
              ) : (
                <StackResources stack={stack} />
              ))}
          </Loader>
        </div>
      </ModalBody>
    );
  }
}

DeploymentFailure.propTypes = {
  deploymentStatus: PropTypes.object.isRequired,
  fetchStacks: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingStacks: PropTypes.bool.isRequired,
  isPendingRequest: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  stack: ImmutablePropTypes.record,
  undeployPlan: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  isFetchingStacks: state.stacks.isFetching,
  isPendingRequest: getCurrentPlanDeploymentStatusUI(state).isPendingRequest,
  stack: getCurrentStack(state)
});

const mapDispatchToProps = (dispatch, { planName }) => ({
  undeployPlan: () => dispatch(startUndeploy(planName)),
  fetchStacks: () => dispatch(fetchStacks())
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentFailure)
);
