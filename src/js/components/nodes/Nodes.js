import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import React, { PropTypes } from 'react';

import NodesActions from '../../actions/NodesActions';
import NodesToolbar from './NodesToolbar';
import NodesTableView from './NodesTableView';
import RolesActions from '../../actions/RolesActions';

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
  }
});

class Nodes extends React.Component {
  componentDidMount() {
    this.props.fetchNodes();
    this.props.fetchRoles(this.props.currentPlanName);
  }

  refreshResults(e) {
    e.preventDefault();
    this.props.fetchNodes();
    this.props.fetchRoles(this.props.currentPlanName);
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <div className="pull-right">
            <a href="" onClick={this.refreshResults.bind(this)}>
              <span className="pficon pficon-refresh" />&nbsp;
              <FormattedMessage {...messages.refreshResults}/>
            </a>
            &nbsp;
            <Link to="/nodes/register"
                  className="btn btn-primary">
              <span className="fa fa-plus"/> <FormattedMessage {...messages.registerNodes}/>
            </Link>
          </div>
          <h1><FormattedMessage {...messages.nodes}/></h1>
        </div>
        <NodesToolbar />
        <NodesTableView />
        {this.props.children}
      </div>
    );
  }
}
Nodes.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentPlanName: state.currentPlan.currentPlanName
});

const mapDispatchToProps = dispatch => ({
  fetchNodes: () => dispatch(NodesActions.fetchNodes()),
  fetchRoles: currentPlanName => dispatch(RolesActions.fetchRoles(currentPlanName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Nodes);
