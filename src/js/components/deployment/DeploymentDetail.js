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
import { ModalHeader, ModalTitle, ModalFooter } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import DeploymentProgress from './DeploymentProgress';
import UndeployProgress from './UndeployProgress';
import DeploymentFailure from './DeploymentFailure';
import { deploymentStates } from '../../constants/DeploymentConstants';
import { getCurrentPlanName } from '../../selectors/plans';
import { Loader } from '../ui/Loader';
import {
  CloseModalButton,
  CloseModalXButton,
  RoutedModalPanel
} from '../ui/Modals';
import {
  getCurrentPlanDeploymentStatus,
  getCurrentPlanDeploymentStatusUI
} from '../../selectors/deployment';

const messages = defineMessages({
  close: {
    id: 'DeploymentDetail.close',
    defaultMessage: 'Close'
  },
  modalTitle: {
    id: 'DeploymentDetail.modalTitle',
    defaultMessage: 'Plan {planName} deployment'
  },
  loadingDeploymentStatus: {
    id: 'DeploymentDetail.loadingDeploymentStatus',
    defaultMessage: 'Loading Deployment Status'
  }
});

class DeploymentDetail extends React.Component {
  renderStatus() {
    const { currentPlanName, deploymentStatus } = this.props;

    switch (deploymentStatus.status) {
      case deploymentStates.DEPLOYING:
        return <DeploymentProgress planName={currentPlanName} />;
      case deploymentStates.UNDEPLOYING:
        return <UndeployProgress planName={currentPlanName} />;
      case deploymentStates.DEPLOY_SUCCESS:
        return (
          <div>
            {deploymentStatus.status}
            {deploymentStatus.message}
          </div>
        );
      case deploymentStates.UNDEPLOY_FAILED:
      case deploymentStates.DEPLOY_FAILED:
        return <DeploymentFailure planName={currentPlanName} />;
      case deploymentStates.UNKNOWN:
      default:
        return null;
    }
  }

  render() {
    const {
      currentPlanName,
      deploymentStatusLoaded,
      intl: { formatMessage }
    } = this.props;
    return (
      <RoutedModalPanel redirectPath={`/plans/${currentPlanName}`}>
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage
              {...messages.modalTitle}
              values={{ planName: currentPlanName }}
            />
          </ModalTitle>
        </ModalHeader>
        <Loader
          loaded={deploymentStatusLoaded}
          className="flex-container"
          content={formatMessage(messages.loadingDeploymentStatus)}
          componentProps={{ className: 'flex-container' }}
          height={40}
        >
          {this.renderStatus()}
        </Loader>
        <ModalFooter>
          <CloseModalButton>
            <FormattedMessage {...messages.close} />
          </CloseModalButton>
        </ModalFooter>
      </RoutedModalPanel>
    );
  }
}

DeploymentDetail.propTypes = {
  currentPlanName: PropTypes.string.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  deploymentStatusLoaded: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  currentPlanName: getCurrentPlanName(state),
  deploymentStatusLoaded: getCurrentPlanDeploymentStatusUI(state).isLoaded,
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  deploymentStatusUIError: getCurrentPlanDeploymentStatusUI(state).error
});

export default injectIntl(connect(mapStateToProps)(DeploymentDetail));
