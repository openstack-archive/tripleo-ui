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

import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';

import { Loader } from '../ui/Loader';
import SelectRolesDialog from './SelectRolesDialog';
import NodesAssignment from './NodesAssignment';

const messages = defineMessages({
  loadingDeploymentRoles: {
    id: 'Roles.loadingDeploymentRoles',
    defaultMessage: 'Loading Deployment Roles...'
  }
});

class Roles extends React.Component {
  componentDidMount() {
    this.props.fetchRoles();
    this.props.fetchNodes();
    this.props.fetchFlavors();
  }

  render() {
    const { intl: { formatMessage }, loaded } = this.props;
    return (
      <div className="panel panel-default cards-pf roles-panel">
        <Loader
          loaded={loaded}
          content={formatMessage(messages.loadingDeploymentRoles)}
          height={40}
        >
          <Route
            path="/plans/:planName/select-roles"
            component={SelectRolesDialog}
          />
          <NodesAssignment />
        </Loader>
      </div>
    );
  }
}
Roles.propTypes = {
  fetchFlavors: PropTypes.func.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  intl: PropTypes.object,
  loaded: PropTypes.bool.isRequired
};

export default injectIntl(Roles);
