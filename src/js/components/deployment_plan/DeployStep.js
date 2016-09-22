import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DeploymentStatus from './DeploymentStatus';
import { Link } from 'react-router';

import Loader from '../ui/Loader';

export const DeployStep = ({ currentPlan, currentStack, deployPlan, fetchStacks,
                             fetchResources, fetchResource, fetchEnvironment }) => {
  if (!currentStack) {
    return (
      <div>
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
        <Link to="/deployment-plan/deployment-detail">View details</Link>
      </div>
    );
  } else {
    return (
      <DeploymentStatus stack={currentStack}
                        fetchEnvironment={fetchEnvironment}
                        fetchResources={fetchResources}
                        fetchResource={fetchResource}
                        fetchStacks={fetchStacks} />

    );
  }
};

DeployStep.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  deployPlan: React.PropTypes.func.isRequired,
  fetchEnvironment: React.PropTypes.func.isRequired,
  fetchResource: React.PropTypes.func.isRequired,
  fetchResources: React.PropTypes.func.isRequired,
  fetchStacks: React.PropTypes.func.isRequired
};
