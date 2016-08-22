import React from 'react';
import { Link } from 'react-router';

import DeploymentConfigurationSummary from './DeploymentConfigurationSummary';

export const ConfigurePlanStep = (props) => {
  return (
    <div>
      <DeploymentConfigurationSummary { ...props } />
      &nbsp;
      <Link to="/deployment-plan/configuration">
        Edit Configuration
      </Link>
    </div>
  );
};
ConfigurePlanStep.propTypes = {
  fetchEnvironmentConfiguration: React.PropTypes.func.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  loaded: React.PropTypes.bool.isRequired,
  planName: React.PropTypes.string.isRequired,
  summary: React.PropTypes.string.isRequired
};
