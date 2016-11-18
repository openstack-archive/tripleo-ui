import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

import DeploymentConfigurationSummary from './DeploymentConfigurationSummary';

export const ConfigurePlanStep = (props) => {
  return (
    <div>
      <DeploymentConfigurationSummary { ...props } />
      &nbsp;
      <Link to="/deployment-plan/configuration">
        <FormattedMessage id="edit-configuration"
                          defaultMessage="Edit Configuration"
                          description="Edit Deployment Link"/>
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
