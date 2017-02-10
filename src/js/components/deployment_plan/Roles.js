import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from '../ui/Loader';
import RoleCard from './RoleCard';

const messages = defineMessages({
  loadingDeploymentRoles: {
    id: 'Roles.loadingDeploymentRoles',
    defaultMessage: 'Loading Deployment Roles...'
  }
});

class Roles extends React.Component {
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

  getAvailableNodesCount(role) {
    const nodesCountParameter = this.props.nodeCountParametersByRole.get(role.identifier);
    const availableNodesCount = this.props.availableNodesByRole.get(role.identifier).size;
    return nodesCountParameter ? availableNodesCount - nodesCountParameter.default : 0;
  }

  renderRoleCards() {
    return this.props.roles.map(role => {
      return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" key={role.name}>
          <RoleCard
            name={role.name}
            title={role.title}
            identifier={role.identifier}
            fetchNodes={this.props.fetchNodes}
            assignedNodesCountParameter={this.props.nodeCountParametersByRole.get(role.identifier)}
            availableNodesCount={this.getAvailableNodesCount(role)}/>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="panel panel-default roles-panel">
        <div className="panel-body">
          <Loader loaded={this.props.loaded}
                  content={this.props.intl.formatMessage(messages.loadingDeploymentRoles)}
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
  availableNodesByRole: ImmutablePropTypes.map.isRequired,
  fetchNodes: React.PropTypes.func.isRequired,
  fetchRoles: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object,
  isFetchingNodes: React.PropTypes.bool,
  isFetchingRoles: React.PropTypes.bool,
  loaded: React.PropTypes.bool.isRequired,
  nodeCountParametersByRole: ImmutablePropTypes.map.isRequired,
  roles: React.PropTypes.array.isRequired
};

export default injectIntl(Roles);
