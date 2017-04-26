import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NavTab from '../ui/NavTab';
import NodesActions from '../../actions/NodesActions';
import RolesActions from '../../actions/RolesActions';
import { getRegisteredNodes,
         getDeployedNodes,
         getMaintenanceNodes } from '../../selectors/nodes';

const messages = defineMessages({
  refreshResults: {
    id: 'Nodes.refreshResults',
    defaultMessage: 'Refresh Results'
  },
  registerNodes: {
    id: 'Nodes.registerNodes',
    defaultMessage: 'Register Nodes'
  },
  nodes: {
    id: 'Nodes.nodes',
    defaultMessage: 'Nodes'
  },
  registeredTab: {
    id: 'Nodes.registeredTab',
    defaultMessage: 'Registered'
  },
  deployedTab: {
    id: 'Nodes.deployedTab',
    defaultMessage: 'Deployed'
  },
  maintenanceTab: {
    id: 'Nodes.maintenanceTab',
    defaultMessage: 'Maintenance'
  }
});

class Nodes extends React.Component {
  componentDidMount() {
    this.props.dispatch(NodesActions.fetchNodes());
    this.props.dispatch(RolesActions.fetchRoles(this.props.currentPlanName));
  }

  refreshResults(e) {
    e.preventDefault();
    this.props.dispatch(NodesActions.fetchNodes());
    this.props.dispatch(RolesActions.fetchRoles(this.props.currentPlanName));
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="page-header">
            <div className="pull-right">
              <a href="" onClick={this.refreshResults.bind(this)}>
                <span className="pficon pficon-refresh"></span>
                <FormattedMessage {...messages.refreshResults}/>
              </a>
              &nbsp;
              <Link to="/nodes/registered/register"
                    className="btn btn-primary">
                <span className="fa fa-plus"/> <FormattedMessage {...messages.registerNodes}/>
              </Link>
            </div>
            <h1><FormattedMessage {...messages.nodes}/></h1>
          </div>
          <ul className="nav nav-tabs">
            <NavTab to="/nodes/registered">
              <FormattedMessage {...messages.registeredTab}/>
              <span className="badge">{this.props.nodes.get('registered').size}</span>
            </NavTab>
            <NavTab to="/nodes/deployed">
              <FormattedMessage {...messages.deployedTab}/>
              <span className="badge">{this.props.nodes.get('deployed').size}</span>
            </NavTab>
            <NavTab to="/nodes/maintenance">
              <FormattedMessage {...messages.maintenanceTab}/>
              <span className="badge">{this.props.nodes.get('maintenance').size}</span>
            </NavTab>
          </ul>
          <div className="tab-pane">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
Nodes.propTypes = {
  children: PropTypes.node.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  nodes: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state) {
  return {
    currentPlanName: state.currentPlan.currentPlanName,
    nodes: state.nodes.merge(
      Map({
        registered: getRegisteredNodes(state),
        deployed: getDeployedNodes(state),
        maintenance: getMaintenanceNodes(state)
      })
    )
  };
}

export default connect(mapStateToProps)(Nodes);
