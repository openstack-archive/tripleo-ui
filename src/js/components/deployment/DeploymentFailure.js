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
import { ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import DeleteStackButton from '../deployment_plan/DeleteStackButton';
import { deploymentStatusMessages } from '../../constants/DeploymentConstants';
import { getCurrentStack } from '../../selectors/stacks';
import { getCurrentPlanDeploymentStatus } from '../../selectors/deployment';
import InlineNotification from '../ui/InlineNotification';
import { sanitizeMessage } from '../../utils';
import StacksActions from '../../actions/StacksActions';

class DeploymentFailure extends React.Component {
  componentDidMount() {
    const { fetchStacks, isFetchingStacks } = this.props;
    !isFetchingStacks && fetchStacks();
  }

  render() {
    const {
      deploymentStatus: { status, message },
      deleteStack,
      intl: { formatMessage },
      isRequestingStackDelete,
      planName,
      stack
    } = this.props;

    return (
      <ModalBody className="flex-container">
        <InlineNotification
          type="error"
          title={formatMessage(deploymentStatusMessages[status], { planName })}
        >
          <p>{sanitizeMessage(message)}</p>
        </InlineNotification>
        <DeleteStackButton
          deleteStack={deleteStack.bind(this, stack)}
          disabled={isRequestingStackDelete || !stack}
          loaded={!isRequestingStackDelete}
        />
      </ModalBody>
    );
  }
}

DeploymentFailure.propTypes = {
  deleteStack: PropTypes.func.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  fetchStacks: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingStacks: PropTypes.bool.isRequired,
  isRequestingStackDelete: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  stack: ImmutablePropTypes.record
};

const mapStateToProps = (state, props) => ({
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  isFetchingStacks: state.stacks.isFetching,
  isRequestingStackDelete: state.stacks.isRequestingStackDelete,
  stack: getCurrentStack(state)
});

const mapDispatchToProps = dispatch => ({
  deleteStack: stack => dispatch(StacksActions.deleteStack(stack)),
  fetchStacks: () => dispatch(StacksActions.fetchStacks())
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentFailure)
);
