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
                            availableNodes,
                            unassignedAvailableNodes,
                            roles,
                            fetchRoles,
                            fetchNodes,
                            intl,
                            isFetchingRoles,
                            rolesLoaded }) => {
  return (
    <div>
      <p>
        <Loader loaded={!isFetchingNodes}
                content={intl.formatMessage(messages.loadingNodes)}
                component="span"
                inline>
          <FormattedMessage {...messages.nodesAvailableToAssign}
                            values={{ nodesCount:
                                      <strong>{unassignedAvailableNodes.size}</strong> }}/>
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
  intl: React.PropTypes.object,
  isFetchingNodes: React.PropTypes.bool.isRequired,
  isFetchingRoles: React.PropTypes.bool.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  rolesLoaded: React.PropTypes.bool.isRequired,
  unassignedAvailableNodes: ImmutablePropTypes.map.isRequired
};

export default injectIntl(RolesStep);
