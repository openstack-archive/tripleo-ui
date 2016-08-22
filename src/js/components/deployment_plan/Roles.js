import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { getAssignedNodes } from '../../selectors/nodes';
import Loader from '../ui/Loader';
import RoleCard from './RoleCard';

export default class Roles extends React.Component {
  componentDidMount() {
    this.props.fetchRoles();
    this.props.fetchNodes();
  }

  componentDidUpdate() {
    if(!this.props.loaded && !this.props.isFetchingRoles) {
      this.props.fetchRoles();
      this.props.fetchNodes();
    }
  }

  getAssignedNodes(availableNodes, roleName) {
    return availableNodes.filter(
      node => node.getIn(['properties', 'capabilities']).includes(`profile:${roleName}`)
    );
  }

  renderRoleCards() {
    return this.props.roles.map(role => {
      return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" key={role.name}>
          <RoleCard name={role.name}
                    title={role.title}
                    fetchNodes={this.props.fetchNodes}
                    assignedNodesCount={getAssignedNodes(this.props.availableNodes,
                                                         role.name).size}
                    availableNodesCount={this.props.unassignedAvailableNodes.size}/>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="panel panel-default roles-panel">
        <div className="panel-body">
          <Loader loaded={this.props.loaded}
                  content="Loading Deployment Roles..."
                  height={40}>
            <div className="row-cards-pf">
              {this.renderRoleCards()}
            </div>
          </Loader>
        </div>
      </div>
    );
  }
}
Roles.propTypes = {
  availableNodes: ImmutablePropTypes.map,
  fetchNodes: React.PropTypes.func.isRequired,
  fetchRoles: React.PropTypes.func.isRequired,
  isFetchingNodes: React.PropTypes.bool,
  isFetchingRoles: React.PropTypes.bool,
  loaded: React.PropTypes.bool.isRequired,
  roles: React.PropTypes.array.isRequired,
  unassignedAvailableNodes: ImmutablePropTypes.map
};
