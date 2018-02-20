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
import { Redirect, Route, Switch } from 'react-router-dom';
import { ModalHeader, ModalTitle } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { checkRunningDeployment } from '../utils/checkRunningDeploymentHOC';
import EnvironmentConfiguration from '../environment_configuration/EnvironmentConfiguration';
import NavTab from '../ui/NavTab';
import { CloseModalXButton, RoutedModalPanel } from '../ui/Modals';
import Parameters from '../parameters/Parameters';

const messages = defineMessages({
  deploymentConfiguration: {
    id: 'DeploymentConfiguration.deploymentConfiguration',
    defaultMessage: 'Deployment Configuration'
  },
  overallSettings: {
    id: 'DeploymentConfiguration.overallSettings',
    defaultMessage: 'Overall Settings'
  },
  parameters: {
    id: 'DeploymentConfiguration.parameters',
    defaultMessage: 'Parameters'
  }
});

const DeploymentConfiguration = ({ location, match }) => (
  <RoutedModalPanel
    id="DeploymentConfiguration__ModalDialog"
    redirectPath={`/plans/${match.params.planName}`}
  >
    <ModalHeader>
      <CloseModalXButton />
      <ModalTitle>
        <FormattedMessage {...messages.deploymentConfiguration} />
      </ModalTitle>
    </ModalHeader>

    <ul className="nav nav-tabs">
      <NavTab
        id="DeploymentConfiguration__OverallSettingsTab"
        to={`${match.url}/environment`}
      >
        <FormattedMessage {...messages.overallSettings} />
      </NavTab>
      <NavTab
        id="DeploymentConfiguration__ParametersTab"
        to={`${match.url}/parameters`}
      >
        <FormattedMessage {...messages.parameters} />
      </NavTab>
    </ul>

    <Switch location={location}>
      <Route
        path="/plans/:planName/configuration/environment"
        component={EnvironmentConfiguration}
      />
      <Route
        path="/plans/:planName/configuration/parameters"
        component={Parameters}
      />
      <Redirect
        from="/plans/:planName/configuration"
        to={`${match.url}/environment`}
      />
    </Switch>
  </RoutedModalPanel>
);
DeploymentConfiguration.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default checkRunningDeployment(DeploymentConfiguration);
