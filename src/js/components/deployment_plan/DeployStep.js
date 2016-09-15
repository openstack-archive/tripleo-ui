import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DeploymentStatus from './DeploymentStatus';

import Loader from '../ui/Loader';

export const DeployStep = ({ currentPlan, currentStack, deployPlan, fetchStacks,
                             getOvercloudInfo, overcloud}) => {
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
                        fetchStacks={fetchStacks}
                        getOvercloudInfo={getOvercloudInfo}
                        overcloud={overcloud} />

    );
  }
};

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  deployPlan: React.PropTypes.func.isRequired,
  fetchStacks: React.PropTypes.func.isRequired,
  getOvercloudInfo: React.PropTypes.func.isRequired,
  overcloud: ImmutablePropTypes.map.isRequired
};
