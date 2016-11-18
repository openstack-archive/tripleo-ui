import { defineMessages, injectIntl } from 'react-intl';
import React from 'react';

import Link from '../ui/Link';

const messages = defineMessages({
  NodesAssigned: {
    id: 'RoleCard.NodesAssigned',
    defaultMessage: 'Nodes assigned'
  },
  AssignNodes: {
    id: 'RoleCard.AssignNodes',
    defaultMessage: 'Assign Nodes'
  }
});

class RoleCard extends React.Component {
  render() {
    const { formatMessage } = this.props.intl;

    const disabled = !this.props.availableNodesCount && !this.props.assignedNodesCount;

    return (
      <div className={`card-pf card-pf-accented role-card ${this.props.identifier}`}>
        <h2 className="card-pf-title">
          {this.props.title}
          <Link to={`deployment-plan/roles/${this.props.identifier}`}
                className="link pull-right"
                title="Edit Role parameters">
            <span className="pficon pficon-edit"/>
          </Link>
        </h2>
        <div className="card-pf-body">
          <p className="card-pf-utilization-details">
            <span className="card-pf-utilization-card-details-count">
              {this.props.assignedNodesCount}
            </span>
            <span className="card-pf-utilization-card-details-description">
              <span className="card-pf-utilization-card-details-line-1">&nbsp;</span>
              <span className="card-pf-utilization-card-details-line-2">
                {formatMessage(messages.NodesAssigned)}
              </span>
            </span>
          </p>
        </div>
        <div className="card-pf-footer">
          <p>
            <Link
              disabled={disabled}
              to={`/deployment-plan/${this.props.identifier}/assign-nodes`}
              className="card-pf-link-with-icon">
              <span className="pficon pficon-add-circle-o" />{formatMessage(messages.AssignNodes)}
            </Link>
          </p>
        </div>
      </div>
    );
  }
}
RoleCard.propTypes = {
  assignedNodesCount: React.PropTypes.number.isRequired,
  availableNodesCount: React.PropTypes.number.isRequired,
  identifier: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object,
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};

export default injectIntl(RoleCard);
