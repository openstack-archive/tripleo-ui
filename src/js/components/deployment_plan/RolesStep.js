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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import Loader from '../ui/Loader';
import Roles from './Roles';

const messages = defineMessages({
  loadingNodes: {
    id: 'RolesStep.loadingNodes',
    defaultMessage: 'Loading Nodes...'
  },
  loadingParameters: {
    id: 'RolesStep.loadingParameters',
    defaultMessage: 'Loading Parameters...'
  },
  nodesAvailableToAssign: {
    id: 'RolesStep.nodesAvailableToAssign',
    defaultMessage:
      '{allNodesCount, number} Nodes Total ' +
      '({totalAssignedNodesCount, number} assigned to roles, ' +
      '{nodesCount, number} available for assignment, ' +
      '{nodesRequireActionCount, number} require action)'
  }
});

const RolesStep = ({
  allNodesCount,
  availableNodesCount,
  availableNodesCountsByRole,
  currentPlanName,
  roles,
  fetchRoles,
  fetchNodes,
  intl,
  isFetchingNodes,
  isFetchingParameters,
  isFetchingRoles,
  nodeCountParametersByRole,
  rolesLoaded,
  totalAssignedNodesCount
}) => {
  const nodesCount = Math.max(0, availableNodesCount - totalAssignedNodesCount);
  const nodesRequireActionCount = Math.max(
    0,
    allNodesCount - availableNodesCount
  );
  return (
    <div>
      <p>
        <Loader
          loaded={!isFetchingNodes}
          content={intl.formatMessage(messages.loadingNodes)}
          component="span"
          inline
        >
          <Loader
            loaded={!isFetchingParameters}
            content={intl.formatMessage(messages.loadingParameters)}
            component="span"
            inline
          >
            <FormattedMessage
              {...messages.nodesAvailableToAssign}
              values={{
                nodesCount,
                allNodesCount,
                totalAssignedNodesCount,
                nodesRequireActionCount
              }}
            />
          </Loader>
        </Loader>
      </p>
      <Roles
        currentPlanName={currentPlanName}
        roles={roles.toList().toJS()}
        availableNodesCountsByRole={availableNodesCountsByRole}
        nodeCountParametersByRole={nodeCountParametersByRole}
        fetchRoles={fetchRoles}
        fetchNodes={fetchNodes}
        isFetchingNodes={isFetchingNodes}
        isFetchingRoles={isFetchingRoles}
        loaded={rolesLoaded}
      />
    </div>
  );
};
RolesStep.propTypes = {
  allNodesCount: PropTypes.number.isRequired,
  availableNodesCount: PropTypes.number.isRequired,
  availableNodesCountsByRole: ImmutablePropTypes.map.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingNodes: PropTypes.bool.isRequired,
  isFetchingParameters: PropTypes.bool.isRequired,
  isFetchingRoles: PropTypes.bool.isRequired,
  nodeCountParametersByRole: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  rolesLoaded: PropTypes.bool.isRequired,
  totalAssignedNodesCount: PropTypes.number.isRequired
};

export default injectIntl(RolesStep);
