import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import DeploymentProgress from './DeploymentProgress';

import Link from '../ui/Link';
import Loader from '../ui/Loader';

export const DeployStep = ({ currentPlan, currentStack, deployPlan, fetchStack, fetchStackResource,
                             fetchStackEnvironment, runPostDeploymentValidations,
                             stacksLoaded }) => {
  if (!currentStack) {
    return (
      <Loader loaded={stacksLoaded}>
        <Link className={`link btn btn-primary btn-lg
                         ${currentPlan.isRequestingPlanDeploy ? 'disabled': null}`}
              to="/deployment-plan/deployment-detail">
          <Loader loaded={!currentPlan.isRequestingPlanDeploy}
                  content="Requesting a deploy..."
                  component="span"
                  inline>
            <span className="fa fa-cloud-upload"/> Validate and Deploy
          </Loader>
        </Link>
      </Loader>
    );
  } else if (currentStack.stack_status.match(/PROGRESS/)) {
    return (
      <DeploymentProgress stack={currentStack}
                          fetchStack={fetchStack} />
    );
  } else if (currentStack.stack_status.match(/SUCCESS/)) {
    return (
      <DeploymentSuccess stack={currentStack}
                         fetchStackResource={fetchStackResource}
                         fetchStackEnvironment={fetchStackEnvironment}
                         runPostDeploymentValidations={runPostDeploymentValidations}/>
    );
  } else {
    return (
      <DeploymentFailure stack={currentStack}/>
    );
  }
};

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  deployPlan: React.PropTypes.func.isRequired,
  fetchStack: React.PropTypes.func.isRequired,
  fetchStackEnvironment: React.PropTypes.func.isRequired,
  fetchStackResource: React.PropTypes.func.isRequired,
  runPostDeploymentValidations: React.PropTypes.func.isRequired,
  stacksLoaded: React.PropTypes.bool.isRequired
};
