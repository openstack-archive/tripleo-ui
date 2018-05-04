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
import { ModalHeader, ModalTitle, ModalFooter } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import { allPreDeploymentValidationsSuccessful } from '../../selectors/validations';
import BlankSlate from '../ui/BlankSlate';
import {
  CloseModalButton,
  CloseModalXButton,
  RoutedModalPanel
} from '../ui/Modals';
import { getCurrentPlanName } from '../../selectors/plans';
import {
  getCurrentPlanDeploymentStatus,
  getCurrentPlanDeploymentStatusUI
} from '../../selectors/deployment';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import InlineNotification from '../ui/InlineNotification';
import { InlineLoader } from '../ui/Loader';
import { startDeployment } from '../../actions/DeploymentActions';
import ValidationsActions from '../../actions/ValidationsActions';

const messages = defineMessages({
  close: {
    id: 'DeploymentDetail.close',
    defaultMessage: 'Close'
  },
  deployButton: {
    id: 'DeploymentConfirmation.deployButton',
    defaultMessage: 'Deploy'
  },
  deploymentConfirmation: {
    id: 'DeploymentConfirmation.deploymentConfirmation',
    defaultMessage: 'Are you sure you want to deploy this plan?'
  },
  deploymentConfirmationHeader: {
    id: 'DeploymentConfirmation.deploymentConfirmationHeader',
    defaultMessage: 'Deploy Plan {planName}'
  },
  modalTitle: {
    id: 'DeploymentDetail.modalTitle',
    defaultMessage: 'Plan {planName} deployment'
  },
  requestingDeploymentLoader: {
    id: 'DeploymentConfirmation.requestingDeploymentLoader',
    defaultMessage: 'Requesting a deployment...'
  },
  summary: {
    id: 'DeploymentConfirmation.summary',
    defaultMessage: 'Summary:'
  },
  validationsNotificationTitle: {
    id: 'DeploymentConfirmation.validationsNotificationTitle',
    defaultMessage:
      'The pre-deployment validations have been started automatically.'
  },
  validationsNotificationMessage: {
    id: 'DeploymentConfirmation.validationsNotificationMessage',
    defaultMessage:
      'It is recommended to wait until these validations finish running ' +
      'and any errors have been resolved before continuing with ' +
      'the deployment.'
  }
});

class DeploymentConfirmation extends React.Component {
  componentDidMount() {
    this.props.runPreDeploymentValidations(this.props.currentPlanName);
  }

  render() {
    const {
      allValidationsSuccessful,
      currentPlanName,
      startDeployment,
      environmentSummary,
      isPendingDeploymentRequest
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
        <div className="flex-container">
          <div className="flex-column deployment-summary">
            <BlankSlate
              iconClass="fa fa-cloud-upload"
              title={this.props.intl.formatMessage(
                messages.deploymentConfirmationHeader,
                { planName: currentPlanName }
              )}
            >
              <p>
                <strong>
                  <FormattedMessage {...messages.summary} />
                </strong>{' '}
                {environmentSummary}
              </p>
              <ValidationsWarning
                allValidationsSuccessful={allValidationsSuccessful}
              />
              <p>
                <FormattedMessage {...messages.deploymentConfirmation} />
              </p>
              <DeployButton
                disabled={isPendingDeploymentRequest}
                deploy={startDeployment.bind(this, currentPlanName)}
              />
            </BlankSlate>
          </div>
        </div>
        <ModalFooter>
          <CloseModalButton>
            <FormattedMessage {...messages.close} />
          </CloseModalButton>
        </ModalFooter>
      </RoutedModalPanel>
    );
  }
}
DeploymentConfirmation.propTypes = {
  allValidationsSuccessful: PropTypes.bool.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  environmentSummary: PropTypes.string.isRequired,
  intl: PropTypes.object,
  isPendingDeploymentRequest: PropTypes.bool.isRequired,
  runPreDeploymentValidations: PropTypes.func.isRequired,
  startDeployment: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
  currentPlanName: getCurrentPlanName(state),
  allValidationsSuccessful: allPreDeploymentValidationsSuccessful(state),
  deploymentStatusLoaded: getCurrentPlanDeploymentStatusUI(state).isLoaded,
  deploymentStatus: getCurrentPlanDeploymentStatus(state),
  deploymentStatusUIError: getCurrentPlanDeploymentStatusUI(state).error,
  environmentSummary: getEnvironmentConfigurationSummary(state),
  isPendingDeploymentRequest: getCurrentPlanDeploymentStatusUI(state)
    .isPendingRequest
});

const mapDispatchToProps = dispatch => ({
  startDeployment: planName => dispatch(startDeployment(planName)),
  runPreDeploymentValidations: planName =>
    dispatch(
      ValidationsActions.runValidationGroups(['pre-deployment'], planName)
    )
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentConfirmation)
);

export const ValidationsWarning = injectIntl(
  ({ allValidationsSuccessful, intl }) => {
    if (!allValidationsSuccessful) {
      return (
        <InlineNotification
          type="info"
          title={intl.formatMessage(messages.validationsNotificationTitle)}
        >
          <p>
            <FormattedMessage {...messages.validationsNotificationMessage} />
          </p>
        </InlineNotification>
      );
    }
    return null;
  }
);
ValidationsWarning.propTypes = {
  allValidationsSuccessful: PropTypes.bool.isRequired,
  intl: PropTypes.object
};

export const DeployButton = injectIntl(
  ({ deploy, disabled, intl, isRequestingPlanDeploy }) => (
    <button
      type="button"
      disabled={disabled}
      className="btn btn-lg btn-primary"
      onClick={() => deploy()}
    >
      <InlineLoader
        loaded={!disabled}
        content={intl.formatMessage(messages.requestingDeploymentLoader)}
      >
        <FormattedMessage {...messages.deployButton} />
      </InlineLoader>
    </button>
  )
);
DeployButton.propTypes = {
  deploy: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object
};
