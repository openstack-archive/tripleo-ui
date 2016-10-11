import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import DeploymentProgress from './DeploymentProgress';
import Link from '../ui/Link';
import Loader from '../ui/Loader';
import { stackStates } from '../../constants/StacksConstants';

export const DeployStep = ({ currentPlan, currentStack, deployPlan, fetchStack, fetchStackResource,
                             fetchStackEnvironment, runPostDeploymentValidations,
                             stacksLoaded }) => {
  if (!currentStack || currentStack.stack_status === stackStates.DELETE_COMPLETE) {
    return (
      <Loader loaded={stacksLoaded}>
        <Link className="link btn btn-primary btn-lg"
              disabled={currentPlan.isRequestingPlanDeploy}
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
  } else if (currentStack.stack_status.match(/COMPLETE/)) {
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
