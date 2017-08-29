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

import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'

import Loader from '../ui/Loader'
import NodesAssignmentForm from './NodesAssignmentForm'
import RoleCard from './RoleCard'

const messages = defineMessages({
  loadingDeploymentRoles: {
    id: 'Roles.loadingDeploymentRoles',
    defaultMessage: 'Loading Deployment Roles...'
  }
})

class Roles extends React.Component {
  componentDidMount() {
    this.props.fetchRoles()
    this.props.fetchNodes()
  }

  componentDidUpdate() {
    if (!this.props.loaded && !this.props.isFetchingRoles) {
      this.props.fetchRoles()
      this.props.fetchNodes()
    }
  }

  renderRoleCards() {
    return this.props.roles.map(role => {
      return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" key={role.name}>
          <RoleCard
            currentPlanName={this.props.currentPlanName}
            name={role.name}
            title={role.title}
            identifier={role.identifier}
            fetchNodes={this.props.fetchNodes}
            assignedNodesCountParameter={this.props.nodeCountParametersByRole.get(
              role.identifier
            )}
            availableNodesCount={this.props.availableNodesCountsByRole.get(
              role.identifier
            )}
          />
        </div>
      )
    })
  }

  render() {
    return (
      <div className="panel panel-default roles-panel">
        <div className="panel-body">
          <Loader
            loaded={this.props.loaded}
            content={this.props.intl.formatMessage(
              messages.loadingDeploymentRoles
            )}
            height={40}
          >
            <div className="row-cards-pf">
              <NodesAssignmentForm>
                {this.renderRoleCards()}
              </NodesAssignmentForm>
            </div>
          </Loader>
        </div>
      </div>
    )
  }
}
Roles.propTypes = {
  availableNodesCountsByRole: ImmutablePropTypes.map.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingNodes: PropTypes.bool,
  isFetchingRoles: PropTypes.bool,
  loaded: PropTypes.bool.isRequired,
  nodeCountParametersByRole: ImmutablePropTypes.map.isRequired,
  roles: PropTypes.array.isRequired
}

export default injectIntl(Roles)
