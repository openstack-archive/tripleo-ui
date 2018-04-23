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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import FlavorsActions from '../../actions/FlavorsActions';
import { getCurrentPlanName } from '../../selectors/plans';
import {
  getAccessibleNodes,
  getAvailableNodes,
  getTotalAssignedNodesCount
} from '../../selectors/nodesAssignment';
import { InlineLoader } from '../ui/Loader';
import { Link } from 'react-router-dom';
import NodesActions from '../../actions/NodesActions';
import Roles from '../roles/Roles';
import RolesActions from '../../actions/RolesActions';

const messages = defineMessages({
  loadingNodes: {
    id: 'RolesStep.loadingNodes',
    defaultMessage: 'Loading Nodes...'
  },
  loadingParameters: {
    id: 'RolesStep.loadingParameters',
    defaultMessage: 'Loading Parameters...'
  },
  manageRoles: {
    id: 'RolesStep.manageRoles',
    defaultMessage: 'Manage Roles'
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
  currentPlanName,
  fetchFlavors,
  fetchRoles,
  fetchNodes,
  flavorsLoaded,
  intl,
  isFetchingNodes,
  isFetchingParameters,
  nodesLoaded,
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
        <InlineLoader
          loaded={!isFetchingNodes}
          content={intl.formatMessage(messages.loadingNodes)}
        >
          <InlineLoader
            loaded={!isFetchingParameters}
            content={intl.formatMessage(messages.loadingParameters)}
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
          </InlineLoader>
        </InlineLoader>
      </p>
      <Roles
        fetchFlavors={fetchFlavors}
        fetchRoles={fetchRoles.bind(this, currentPlanName)}
        fetchNodes={fetchNodes}
        loaded={rolesLoaded && nodesLoaded && flavorsLoaded}
      />
      <Link
        className="btn btn-default"
        to={`/plans/${currentPlanName}/select-roles`}
      >
        <FormattedMessage {...messages.manageRoles} />
      </Link>
    </div>
  );
};
RolesStep.propTypes = {
  allNodesCount: PropTypes.number.isRequired,
  availableNodesCount: PropTypes.number.isRequired,
  currentPlanName: PropTypes.string,
  fetchFlavors: PropTypes.func.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  flavorsLoaded: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  isFetchingNodes: PropTypes.bool.isRequired,
  isFetchingParameters: PropTypes.bool.isRequired,
  nodesLoaded: PropTypes.bool.isRequired,
  rolesLoaded: PropTypes.bool.isRequired,
  totalAssignedNodesCount: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  allNodesCount: getAccessibleNodes(state).size,
  availableNodesCount: getAvailableNodes(state).size,
  currentPlanName: getCurrentPlanName(state),
  flavorsLoaded: state.flavors.isLoaded,
  isFetchingNodes: state.nodes.get('isFetching'),
  isFetchingParameters: state.parameters.isFetching,
  rolesLoaded: state.roles.loaded,
  nodesLoaded: state.nodes.isLoaded,
  totalAssignedNodesCount: getTotalAssignedNodesCount(state)
});
const mapDispatchToProps = dispatch => ({
  fetchFlavors: () => dispatch(FlavorsActions.fetchFlavors()),
  fetchRoles: planName => dispatch(RolesActions.fetchRoles(planName)),
  fetchNodes: () => dispatch(NodesActions.fetchNodes())
});

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(RolesStep))
);
