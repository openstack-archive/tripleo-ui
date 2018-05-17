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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'patternfly-react';
import { FormattedMessage, injectIntl } from 'react-intl';

import { defineMessages } from 'react-intl';
import { getCurrentPlanName } from '../../selectors/plans';
import { getCurrentPlanDeploymentStatusUI } from '../../selectors/deployment';
import { InlineLoader } from '../ui/Loader';
import { recoverDeploymentStatus } from '../../actions/DeploymentActions';

const messages = defineMessages({
  recoveringDeploymentStatus: {
    id: 'RecoverDeploymentStatusButton.recoveringDeploymentStatus',
    defaultMessage: 'Recovering deployment status'
  },
  recoverDeploymentStatus: {
    id: 'RecoverDeploymentStatusButton.recoverDeploymentStatus',
    defaultMessage: 'Recover deployment status'
  }
});
const RecoverDeploymentStatusButton = ({
  currentPlanName,
  intl: { formatMessage },
  isPendingRequest,
  recoverDeploymentStatus
}) => (
  <Button
    disabled={isPendingRequest}
    onClick={() => recoverDeploymentStatus(currentPlanName)}
  >
    <InlineLoader
      loaded={!isPendingRequest}
      content={formatMessage(messages.recoveringDeploymentStatus)}
    >
      <FormattedMessage {...messages.recoverDeploymentStatus} />
    </InlineLoader>
  </Button>
);
RecoverDeploymentStatusButton.propTypes = {
  currentPlanName: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  isPendingRequest: PropTypes.bool.isRequired,
  recoverDeploymentStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentPlanName: getCurrentPlanName(state),
  isPendingRequest: getCurrentPlanDeploymentStatusUI(state).isPendingRequest
});
export default injectIntl(
  connect(mapStateToProps, { recoverDeploymentStatus })(
    RecoverDeploymentStatusButton
  )
);
