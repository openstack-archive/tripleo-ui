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
import { Link } from 'react-router';
import React, { PropTypes } from 'react';

import NavTab from '../ui/NavTab';
import Modal from '../ui/Modal';

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

export default class DeploymentConfiguration extends React.Component {
  render() {
    return (
      <Modal dialogClasses="modal-xl">
        <div className="modal-header">
          <Link to={this.props.parentPath}
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
            <h4 className="modal-title">
              <FormattedMessage {...messages.deploymentConfiguration}/>
            </h4>
        </div>

        <ul className="nav nav-tabs">
          <NavTab to="/deployment-plan/configuration/environment">
            <FormattedMessage {...messages.overallSettings}/>
          </NavTab>
          <NavTab to="/deployment-plan/configuration/parameters">
            <FormattedMessage {...messages.parameters}/>
          </NavTab>
        </ul>

        {React.cloneElement(this.props.children,
                            {currentPlanName: this.props.currentPlanName,
                             parentPath: this.props.parentPath})}
      </Modal>
    );
  }
}
DeploymentConfiguration.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string,
  parentPath: PropTypes.string
};
