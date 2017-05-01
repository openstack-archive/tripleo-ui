import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';

import Loader from '../ui/Loader';
import NodesAssignmentForm from './NodesAssignmentForm';
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
    if (!this.props.loaded && !this.props.isFetchingRoles) {
      this.props.fetchRoles();
      this.props.fetchNodes();
    }
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
            assignedNodesCountParameter={this.props.nodeCountParametersByRole.get(
              role.identifier
            )}
            availableNodesCount={this.props.availableNodesCountsByRole.get(
              role.identifier
            )}
          />
        </div>
      );
    });
  }

  render() {
    return (
      <div className="panel panel-default roles-panel">
        <div className="panel-body">
          <Loader
            loaded={this.props.loaded}
            content={this.props.intl.formatMessage(
              messages.loadingDeploymentRoles
            )}
            height={40}
          >
            <div className="row-cards-pf">
              <NodesAssignmentForm>
                {this.renderRoleCards()}
              </NodesAssignmentForm>
            </div>
          </Loader>
        </div>
      </div>
    );
  }
}
Roles.propTypes = {
  availableNodesCountsByRole: ImmutablePropTypes.map.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingNodes: PropTypes.bool,
  isFetchingRoles: PropTypes.bool,
  loaded: PropTypes.bool.isRequired,
  nodeCountParametersByRole: ImmutablePropTypes.map.isRequired,
  roles: PropTypes.array.isRequired
};

export default injectIntl(Roles);
