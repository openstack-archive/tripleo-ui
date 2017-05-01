import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import BlankSlate from '../ui/BlankSlate';
import InlineNotification from '../ui/InlineNotification';
import Loader from '../ui/Loader';

const messages = defineMessages({
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
  requestingDeploymentLoader: {
    id: 'DeploymentConfirmation.requestingDeploymentLoader',
    defaultMessage: 'Requesting a deployment...'
  },
  summary: {
    id: 'DeploymentConfirmation.summary',
    defaultMessage: 'Summary:'
  },
  validationsWarningTitle: {
    id: 'DeploymentConfirmation.validationsWarningTitle',
    defaultMessage: 'Not all pre-deployment validations have passed.'
  },
  validationsWarningMessage: {
    id: 'DeploymentConfirmation.validationsWarningMessage',
    defaultMessage: 'It is highly recommended that you resolve all validation issues before ' +
      'continuing.'
  }
});

class DeploymentConfirmation extends React.Component {
  componentDidMount() {
    this.props.runPreDeploymentValidations(this.props.currentPlan.name);
  }

  render() {
    const {
      allValidationsSuccessful,
      currentPlan,
      deployPlan,
      environmentSummary
    } = this.props;

    return (
      <div className="col-sm-12 deployment-summary">
        <BlankSlate
          iconClass="fa fa-cloud-upload"
          title={this.props.intl.formatMessage(
            messages.deploymentConfirmationHeader,
            { planName: currentPlan.name }
          )}
        >
          <p>
            <strong><FormattedMessage {...messages.summary} /></strong>
            {' '}
            {environmentSummary}
          </p>
          <ValidationsWarning
            allValidationsSuccessful={allValidationsSuccessful}
          />
          <p>
            <FormattedMessage {...messages.deploymentConfirmation} />
          </p>
          <DeployButton
            disabled={currentPlan.isRequestingPlanDeploy}
            deploy={deployPlan.bind(this, currentPlan.name)}
            isRequestingPlanDeploy={currentPlan.isRequestingPlanDeploy}
          />
        </BlankSlate>
      </div>
    );
  }
}
DeploymentConfirmation.propTypes = {
  allValidationsSuccessful: PropTypes.bool.isRequired,
  currentPlan: ImmutablePropTypes.record.isRequired,
  deployPlan: PropTypes.func.isRequired,
  environmentSummary: PropTypes.string.isRequired,
  intl: PropTypes.object,
  runPreDeploymentValidations: PropTypes.func.isRequired
};

export default injectIntl(DeploymentConfirmation);

export const ValidationsWarning = injectIntl(
  ({ allValidationsSuccessful, intl }) => {
    if (!allValidationsSuccessful) {
      return (
        <InlineNotification
          type="warning"
          title={intl.formatMessage(messages.validationsWarningTitle)}
        >
          <p>
            <FormattedMessage {...messages.validationsWarningMessage} />
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
  ({ deploy, disabled, intl, isRequestingPlanDeploy }) => {
    return (
      <button
        type="button"
        disabled={disabled}
        className="btn btn-lg btn-primary"
        onClick={() => deploy()}
      >
        <Loader
          loaded={!isRequestingPlanDeploy}
          content={intl.formatMessage(messages.requestingDeploymentLoader)}
          component="span"
          inline
        >
          <span className="fa fa-cloud-upload" />
          {' '}
          <FormattedMessage {...messages.deployButton} />
        </Loader>
      </button>
    );
  }
);
DeployButton.propTypes = {
  deploy: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  isRequestingPlanDeploy: PropTypes.bool.isRequired
};
