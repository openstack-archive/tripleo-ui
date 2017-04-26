import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import { getFilterByName } from '../../selectors/filters';
import { getFilteredNodes, nodesInProgress } from '../../selectors/nodes';
import NodesActions from '../../actions/NodesActions';
import NodesListForm from './NodesListView/NodesListForm';
import NodesListView from './NodesListView/NodesListView';
import NodesToolbar from './NodesToolbar/NodesToolbar';
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

  renderContentView() {
    return this.props.contentView === 'table'
      ? <NodesTableView />
      : <NodesListForm>
          <NodesListView
            nodes={this.props.nodes}
            nodesInProgress={this.props.nodesInProgress}
          />
        </NodesListForm>;
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <div className="pull-right">
            <a
              className="link btn btn-link"
              onClick={this.refreshResults.bind(this)}
            >
              <span className="pficon pficon-refresh" />&nbsp;
              <FormattedMessage {...messages.refreshResults} />
            </a>
            &nbsp;
            <Link to="/nodes/register" className="btn btn-primary">
              <span className="fa fa-plus" />&nbsp;
              <FormattedMessage {...messages.registerNodes} />
            </Link>
          </div>
          <h1><FormattedMessage {...messages.nodes} /></h1>
        </div>
        <NodesToolbar />
        {this.renderContentView()}
        {this.props.children}
      </div>
    );
  }
}
Nodes.propTypes = {
  children: PropTypes.node,
  contentView: PropTypes.string.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  nodes: ImmutablePropTypes.map.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired
};

const mapStateToProps = state => ({
  contentView: getFilterByName(state, 'nodesToolbar').get(
    'contentView',
    'list'
  ),
  currentPlanName: state.currentPlan.currentPlanName,
  nodes: getFilteredNodes(state),
  nodesInProgress: nodesInProgress(state)
});

const mapDispatchToProps = dispatch => ({
  fetchNodes: () => dispatch(NodesActions.fetchNodes()),
  fetchRoles: currentPlanName =>
    dispatch(RolesActions.fetchRoles(currentPlanName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Nodes);
