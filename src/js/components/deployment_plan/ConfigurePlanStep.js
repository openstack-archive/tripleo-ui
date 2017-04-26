import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import DeploymentConfigurationSummary from './DeploymentConfigurationSummary';

const messages = defineMessages({
  editConfigurationLink: {
    id: 'ConfigurePlanStep.editConfigurationLink',
    defaultMessage: 'Edit Configuration'
  }
});

const ConfigurePlanStep = (props) => {
  return (
    <div>
      <DeploymentConfigurationSummary { ...props } />
      &nbsp;
      <Link to="/deployment-plan/configuration">
        <FormattedMessage { ...messages.editConfigurationLink} />
      </Link>
    </div>
  );
};
ConfigurePlanStep.propTypes = {
  fetchEnvironmentConfiguration: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired
};

export default ConfigurePlanStep;
