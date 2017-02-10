import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Link from '../ui/Link';

const messages = defineMessages({
  nodesAssigned: {
    id: 'RoleCard.nodesAssigned',
    defaultMessage: 'Nodes assigned'
  },
  assignNodes: {
    id: 'RoleCard.assignNodes',
    defaultMessage: 'Assign Nodes'
  },
  availableNodesCount: {
    id: 'RoleCard.availableNodesCount',
    defaultMessage: 'of {count}',
    description: 'Used to display available nodes to assign, e.g. 1 of 2 Nodes Assigned'
  }
});

const RoleCard = ({ assignedNodesCountParameter,
                    availableNodesCount,
                    identifier,
                    name,
                    title }) => {
  const disabled = !assignedNodesCountParameter
                   || !availableNodesCount && !assignedNodesCountParameter.default;
  return (
    <div className={`card-pf card-pf-accented role-card ${identifier}`}>
      <h2 className="card-pf-title">
        {title}
        <Link to={`deployment-plan/roles/${identifier}`}
              className="link pull-right"
              title="Edit Role parameters">
          <span className="pficon pficon-edit"/>
        </Link>
      </h2>
      <div className="card-pf-body">
        <p className="card-pf-utilization-details">
          <span className="card-pf-utilization-card-details-count">
            {assignedNodesCountParameter ? assignedNodesCountParameter.default : '-'}
          </span>
          <span className="card-pf-utilization-card-details-description">
            <span className="card-pf-utilization-card-details-line-1">
              <FormattedMessage
                {...messages.availableNodesCount}
                values={{ count: availableNodesCount }}/>
            </span>
            <span className="card-pf-utilization-card-details-line-2">
              <FormattedMessage {...messages.nodesAssigned}/>
            </span>
          </span>
        </p>
      </div>
      <div className="card-pf-footer">
        <p>
          <Link
            disabled={disabled}
            to={`/deployment-plan/${identifier}/assign-nodes`}
            className="card-pf-link-with-icon">
            <span className="pficon pficon-add-circle-o" />
            <FormattedMessage {...messages.assignNodes}/>
          </Link>
        </p>
      </div>
    </div>
  );
};
RoleCard.propTypes = {
  assignedNodesCountParameter: ImmutablePropTypes.record,
  availableNodesCount: React.PropTypes.number.isRequired,
  identifier: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};

export default RoleCard;
