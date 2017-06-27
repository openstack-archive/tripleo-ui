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
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { checkRunningDeployment } from '../utils/checkRunningDeploymentHOC';
import EnvironmentConfiguration
  from '../environment_configuration/EnvironmentConfiguration';
import NavTab from '../ui/NavTab';
import Modal from '../ui/Modal';
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

class DeploymentConfiguration extends React.Component {
  render() {
    const { location, match } = this.props;
    return (
      <Modal id="DeploymentConfiguration__ModalDialog" dialogClasses="modal-xl">
        <div className="modal-header">
          <Link
            to={`/plans/${match.params.planName}`}
            type="button"
            className="close"
          >
            <span aria-hidden="true" className="pficon pficon-close" />
          </Link>
          <h4 className="modal-title">
            <FormattedMessage {...messages.deploymentConfiguration} />
          </h4>
        </div>

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
      </Modal>
    );
  }
}
DeploymentConfiguration.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default checkRunningDeployment(DeploymentConfiguration);
