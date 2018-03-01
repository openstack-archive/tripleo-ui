/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import DeploymentConfigurationSummary from './DeploymentConfigurationSummary';

const messages = defineMessages({
  editConfigurationLink: {
    id: 'ConfigurePlanStep.editConfigurationLink',
    defaultMessage: 'Edit Configuration'
  }
});

const ConfigurePlanStep = props => (
  <div>
    <DeploymentConfigurationSummary {...props} />
    <br />
    <Link
      className="btn btn-default"
      id="ConfigurePlanStep__EditDeploymentLink"
      to={`/plans/${props.planName}/configuration`}
    >
      <FormattedMessage {...messages.editConfigurationLink} />
    </Link>
  </div>
);
ConfigurePlanStep.propTypes = {
  fetchEnvironmentConfiguration: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired
};

export default ConfigurePlanStep;
