import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from '../ui/Loader';
import Roles from './Roles';

const messages = defineMessages({
  loadingNodes: {
    id: 'RolesStep.loadingNodes',
    defaultMessage: 'Loading Nodes...'
  },
  nodesAvailableToAssign: {
    id: 'RolesStep.nodesAvailableToAssign',
    defaultMessage: '{nodesCount} Nodes available to assign.'
  }
});

const RolesStep = ({ isFetchingNodes,
                     nodeCountParametersByRole,
                     availableNodesByRole,
                     availableNodesCount,
                     availableNodesCountsByRole,
                     roles,
                     fetchRoles,
                     fetchNodes,
                     intl,
                     isFetchingRoles,
                     rolesLoaded,
                     totalAssignedNodesCount }) => {
  const nodesCount = (
    <strong>{Math.max(0, availableNodesCount - totalAssignedNodesCount)}</strong>
  );
  return (
    <div>
      <p>
        <Loader loaded={!isFetchingNodes}
                content={intl.formatMessage(messages.loadingNodes)}
                component="span"
                inline>
          <FormattedMessage
            {...messages.nodesAvailableToAssign}
            values={{ nodesCount: nodesCount }}/>
        </Loader>
      </p>
      <Roles roles={roles.toList().toJS()}
             availableNodesByRole={availableNodesByRole}
             availableNodesCountsByRole={availableNodesCountsByRole}
             nodeCountParametersByRole={nodeCountParametersByRole}
             fetchRoles={fetchRoles}
             fetchNodes={fetchNodes}
             isFetchingNodes={isFetchingNodes}
             isFetchingRoles={isFetchingRoles}
             loaded={rolesLoaded}/>
    </div>
  );
};
RolesStep.propTypes = {
  availableNodesByRole: ImmutablePropTypes.map.isRequired,
  availableNodesCount: React.PropTypes.number.isRequired,
  availableNodesCountsByRole: React.PropTypes.number.isRequired,
  fetchNodes: React.PropTypes.func.isRequired,
  fetchRoles: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object,
  isFetchingNodes: React.PropTypes.bool.isRequired,
  isFetchingRoles: React.PropTypes.bool.isRequired,
  nodeCountParametersByRole: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  rolesLoaded: React.PropTypes.bool.isRequired,
  totalAssignedNodesCount: React.PropTypes.number.isRequired
};

export default injectIntl(RolesStep);
