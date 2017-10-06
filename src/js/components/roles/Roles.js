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
import { Route, Switch } from 'react-router-dom';

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
          <Switch>
            <Route path="/plans/:planName/select-roles">
              <SelectRolesDialog />
            </Route>
            <Route>
              <NodesAssignment />
            </Route>
          </Switch>
        </Loader>
      </div>
    );
  }
}
Roles.propTypes = {
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  intl: PropTypes.object,
  loaded: PropTypes.bool.isRequired
};

export default injectIntl(Roles);
