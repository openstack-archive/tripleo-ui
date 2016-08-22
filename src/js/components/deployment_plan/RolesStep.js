import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Loader from '../ui/Loader';
import Roles from './Roles';

export const RolesStep = ({ isFetchingNodes,
                            availableNodes,
                            unassignedAvailableNodes,
                            roles,
                            fetchRoles,
                            fetchNodes,
                            isFetchingRoles,
                            rolesLoaded }) => {
  return (
    <div>
      <p>
        <Loader loaded={!isFetchingNodes}
                content="Loading Nodes..."
                component="span"
                inline>
            <strong>{unassignedAvailableNodes.size}</strong> Nodes
            available to assign
        </Loader>
      </p>
      <Roles roles={roles.toList().toJS()}
             availableNodes={availableNodes}
             unassignedAvailableNodes={unassignedAvailableNodes}
             fetchRoles={fetchRoles}
             fetchNodes={fetchNodes}
             isFetchingNodes={isFetchingNodes}
             isFetchingRoles={isFetchingRoles}
             loaded={rolesLoaded}/>
    </div>
  );
};
RolesStep.propTypes = {
  availableNodes: ImmutablePropTypes.map.isRequired,
  fetchNodes: React.PropTypes.func.isRequired,
  fetchRoles: React.PropTypes.func.isRequired,
  isFetchingNodes: React.PropTypes.bool.isRequired,
  isFetchingRoles: React.PropTypes.bool.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  rolesLoaded: React.PropTypes.bool.isRequired,
  unassignedAvailableNodes: ImmutablePropTypes.map.isRequired
};
