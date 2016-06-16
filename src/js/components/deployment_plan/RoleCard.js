import React from 'react';
import { Link } from 'react-router';

export default class RoleCard extends React.Component {
  render() {
    return (
      <div className={`card-pf card-pf-accented role-card ${this.props.name}`}>
        <h2 className="card-pf-title">
          {this.props.title}
        </h2>
        <div className="card-pf-body">
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
        </div>
        <div className="card-pf-footer">
          <p>
            <Link to={`/deployment-plan/${this.props.name}/assignNodes`}
                  onClick={(e) => this.props.availableNodesCount ? null : e.preventDefault()}
                  className={'card-pf-link-with-icon ' +
                             (this.props.availableNodesCount ? '' : 'disabled')} >
              <span className="pficon pficon-add-circle-o" />Assign Nodes
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
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};
