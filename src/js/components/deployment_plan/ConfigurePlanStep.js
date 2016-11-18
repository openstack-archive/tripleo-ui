import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

import DeploymentConfigurationSummary from './DeploymentConfigurationSummary';

const messages = defineMessages({
  EditConfigurationLink: {
    id: 'ConfigurePlanStep.EditConfigurationLink',
    defaultMessage: 'Edit Configurations'
  }
});

const ConfigurePlanStep = (props) => {
  const { formatMessage } = props.intl;

  return (
    <div>
      <DeploymentConfigurationSummary { ...props } />
      &nbsp;
      <Link to="/deployment-plan/configuration">
        {formatMessage(messages.EditConfigurationLink)}
      </Link>
    </div>
  );
};
ConfigurePlanStep.propTypes = {
  fetchEnvironmentConfiguration: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object,
  isFetching: React.PropTypes.bool.isRequired,
  loaded: React.PropTypes.bool.isRequired,
  planName: React.PropTypes.string.isRequired,
  summary: React.PropTypes.string.isRequired
};

export default injectIntl(ConfigurePlanStep);
