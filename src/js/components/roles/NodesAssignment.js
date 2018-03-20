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
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';

import {
  getAssignedNodesCountsByRole,
  getAvailableNodesCountsByRole,
  getNodeCountParametersByRole
} from '../../selectors/nodesAssignment';
import { getCurrentPlanName } from '../../selectors/plans';
import { getRoles } from '../../selectors/roles';
import NodesAssignmentForm from './NodesAssignmentForm';
import ParametersActions from '../../actions/ParametersActions';
import RoleCard from './RoleCard';

const NodesAssignment = ({
  assignedNodesCountsByRole,
  availableNodesCountsByRole,
  currentPlanName,
  nodeCountParametersByRole,
  roles,
  updateNodesAssignment
}) => {
  return (
    <NodesAssignmentForm
      currentPlanName={currentPlanName}
      initialValues={assignedNodesCountsByRole.toJS()}
      updateNodesAssignment={updateNodesAssignment}
    >
      <div className="row row-cards-pf">
        {roles.toList().map(role => {
          return (
            <RoleCard
              key={role.name}
              currentPlanName={currentPlanName}
              name={role.name}
              title={startCase(role.name)}
              identifier={role.identifier}
              assignedNodesCountParameter={nodeCountParametersByRole.get(
                role.name
              )}
              availableNodesCount={availableNodesCountsByRole.get(role.name)}
            />
          );
        })}
      </div>
    </NodesAssignmentForm>
  );
};
NodesAssignment.propTypes = {
  assignedNodesCountsByRole: ImmutablePropTypes.map.isRequired,
  availableNodesCountsByRole: ImmutablePropTypes.map.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  nodeCountParametersByRole: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  updateNodesAssignment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  assignedNodesCountsByRole: getAssignedNodesCountsByRole(state),
  availableNodesCountsByRole: getAvailableNodesCountsByRole(state),
  currentPlanName: getCurrentPlanName(state),
  nodeCountParametersByRole: getNodeCountParametersByRole(state),
  roles: getRoles(state)
});

const mapDispatchToProps = dispatch => {
  return {
    updateNodesAssignment: (currentPlanName, data) => {
      dispatch(ParametersActions.updateNodesAssignment(currentPlanName, data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodesAssignment);
