import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import BlankSlate from '../ui/BlankSlate';
import InlineNotification from '../ui/InlineNotification';
import Loader from '../ui/Loader';

const DeploymentConfirmation = ({ allValidationsSuccessful,
                                  currentPlan,
                                  deployPlan,
                                  environmentSummary }) => {
  return (
    <div className="col-sm-12 deployment-summary">
      <BlankSlate iconClass="fa fa-cloud-upload"
                  title={`Deploy Plan ${currentPlan.name}`}>
        <p><strong>Summary:</strong> {environmentSummary}</p>
        <ValidationsWarning allValidationsSuccessful={allValidationsSuccessful}/>
        <p>
          Are you sure you want to deploy this plan?
        </p>
        <DeployButton
          disabled={currentPlan.isRequestingPlanDeploy}
          deploy={deployPlan.bind(this, currentPlan.name)}
          isRequestingPlanDeploy={currentPlan.isRequestingPlanDeploy}/>
      </BlankSlate>
    </div>
  );
};
DeploymentConfirmation.propTypes = {
  allValidationsSuccessful: React.PropTypes.bool.isRequired,
  currentPlan: ImmutablePropTypes.record.isRequired,
  deployPlan: React.PropTypes.func.isRequired,
  environmentSummary: React.PropTypes.string.isRequired
};
export default DeploymentConfirmation;


export const ValidationsWarning = ({ allValidationsSuccessful }) => {
  if (!allValidationsSuccessful) {
    return (
      <InlineNotification type="warning"
                          title="Not all pre-deployment validations have passed">
        <p>It is highly recommended that you resolve all validation issues before continuing.</p>
      </InlineNotification>
    );
  }
  return null;
};
ValidationsWarning.propTypes = {
  allValidationsSuccessful: React.PropTypes.bool.isRequired
};


export const DeployButton = ({ deploy, disabled, isRequestingPlanDeploy }) => {
  return (
    <button type="button"
            disabled={disabled}
            className="btn btn-lg btn-primary"
            onClick={() => deploy()}>
      <Loader loaded={!isRequestingPlanDeploy}
              content="Requesting a deploy..."
              component="span"
              inline>
        <span className="fa fa-cloud-upload"/> Deploy
      </Loader>
    </button>
  );
};
DeployButton.propTypes = {
  deploy: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  isRequestingPlanDeploy: React.PropTypes.bool.isRequired
};
