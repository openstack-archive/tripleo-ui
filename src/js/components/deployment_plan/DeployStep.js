import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DeploymentStatus from './DeploymentStatus';

import Loader from '../ui/Loader';

export const DeployStep = ({ currentPlan,
                             currentStack,
                             deployPlan,
                             fetchResources,
                             fetchStacks }) => {
  if (!currentStack) {
    return (
      <a className={`link btn btn-primary btn-lg
                    ${currentPlan.isRequestingPlanDeploy ? 'disabled': null}`}
         onClick={() => deployPlan(currentPlan.name)}>
        <Loader loaded={!currentPlan.isRequestingPlanDeploy}
                content="Requesting a deploy..."
                component="span"
                inline>
          <span className="fa fa-send"/> Start Deployment
        </Loader>
      </a>
    );
  } else {
    return (
      <DeploymentStatus stack={currentStack}
                        fetchResources={fetchResources}
                        fetchStacks={fetchStacks}/>
    );
  }
};

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  deployPlan: React.PropTypes.func.isRequired,
  fetchResources: React.PropTypes.func.isRequired,
  fetchStacks: React.PropTypes.func.isRequired
};
