import React from 'react';

import Loader from '../ui/Loader';

export default class RoleCard extends React.Component {
  render() {
    return (
      <div className={`card-pf card-pf-accented role-card ${this.props.name}`}>
        <h2 className="card-pf-title">
          {this.props.title}
        </h2>
        <div className="card-pf-body">
          <Loader loaded={!this.props.isFetchingNodes}
                  content="Loading Nodes..."
                  inline>
            <p className="card-pf-utilization-details">
              <span className="card-pf-utilization-card-details-count">
                {this.props.assignedNodesCount}
              </span>
              <span className="card-pf-utilization-card-details-description">
                <span className="card-pf-utilization-card-details-line-1">Nodes assigned</span>
                <span className="card-pf-utilization-card-details-line-2">
                  of {this.props.availableNodesCount} available
                </span>
              </span>
            </p>
          </Loader>
        </div>
        <div className="card-pf-footer">
          <p>
            <a href="#" className="card-pf-link-with-icon">
              <span className="pficon pficon-add-circle-o"></span>Assign Nodes
            </a>
          </p>
        </div>
      </div>
    );
  }
}
RoleCard.propTypes = {
  assignedNodesCount: React.PropTypes.number.isRequired,
  availableNodesCount: React.PropTypes.number.isRequired,
  isFetchingNodes: React.PropTypes.bool,
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};
