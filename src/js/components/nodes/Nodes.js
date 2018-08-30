/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';

import { getFilterByName } from '../../selectors/filters';
import { getFilteredNodes, nodesInProgress } from '../../selectors/nodes';
import { Loader, InlineLoader } from '../ui/Loader';
import NodeDrives from './NodeDrives/NodeDrives';
import NodesActions from '../../actions/NodesActions';
import NodesListForm from './NodesListView/NodesListForm';
import NodesListView from './NodesListView/NodesListView';
import NodesToolbar from './NodesToolbar/NodesToolbar';
import NodesTableView from './NodesTableView';
import RegisterNodesDialog from './registerNodes/RegisterNodesDialog';
import StacksActions from '../../actions/StacksActions';

const messages = defineMessages({
  loadingNodes: {
    id: 'Nodes.loadingNodes',
    defaultMessage: 'Loading Nodes...'
  },
  refreshResults: {
    id: 'Nodes.refreshResults',
    defaultMessage: 'Refresh Results'
  },
  registerNodes: {
    id: 'Nodes.registerNodes',
    defaultMessage: 'Register Nodes'
  },
  registeringNodes: {
    id: 'Nodes.registeringNodes',
    defaultMessage: 'Registering Nodes...'
  },
  nodes: {
    id: 'Nodes.nodes',
    defaultMessage: 'Nodes'
  }
});

class Nodes extends React.Component {
  componentDidMount() {
    const {
      fetchNodes,
      fetchStacks,
      fetchingStacks,
      fetchingNodes
    } = this.props;
    fetchingNodes || fetchNodes();
    fetchingStacks || fetchStacks();
  }

  refreshResults(e) {
    e.preventDefault();
    this.props.fetchNodes();
    this.props.fetchStacks();
  }

  renderContentView() {
    return this.props.contentView === 'table' ? (
      <NodesTableView />
    ) : (
      <NodesListForm>
        <NodesListView
          fetchNodeIntrospectionData={this.props.fetchNodeIntrospectionData}
          nodes={this.props.nodes}
          nodesInProgress={this.props.nodesInProgress}
        />
      </NodesListForm>
    );
  }

  render() {
    const {
      fetchingNodes,
      fetchingStacks,
      nodesLoaded,
      intl: { formatMessage },
      isRegistering,
      stacksLoaded
    } = this.props;
    return (
      <div>
        <div className="page-header">
          <div className="pull-right">
            <InlineLoader
              loaded={!(fetchingNodes || fetchingStacks)}
              content={formatMessage(messages.loadingNodes)}
              component="span"
            >
              <a
                id="Nodes__refreshResultsLink"
                className="link btn btn-link"
                onClick={this.refreshResults.bind(this)}
              >
                <span className="pficon pficon-refresh" />&nbsp;
                <FormattedMessage {...messages.refreshResults} />
              </a>
            </InlineLoader>
            &nbsp;
            <Link
              to="/nodes/register"
              className="btn btn-primary"
              id="Nodes__registerNodesLink"
            >
              <FormattedMessage {...messages.registerNodes} />
            </Link>
          </div>
          <h1>
            <FormattedMessage {...messages.nodes} />
          </h1>
        </div>
        <Loader
          loaded={nodesLoaded && stacksLoaded}
          content={formatMessage(messages.loadingNodes)}
          height={80}
        >
          <NodesToolbar />
          <Loader
            loaded={!isRegistering}
            content={formatMessage(messages.registeringNodes)}
            height={80}
          />
          {this.renderContentView()}
        </Loader>
        <Route path="/nodes/register" component={RegisterNodesDialog} />
        <Route path="/nodes/:nodeId/drives" component={NodeDrives} />
      </div>
    );
  }
}
Nodes.propTypes = {
  contentView: PropTypes.string.isRequired,
  fetchNodeIntrospectionData: PropTypes.func.isRequired,
  fetchNodes: PropTypes.func.isRequired,
  fetchStacks: PropTypes.func.isRequired,
  fetchingNodes: PropTypes.bool.isRequired,
  fetchingStacks: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  isRegistering: PropTypes.bool.isRequired,
  nodes: ImmutablePropTypes.map.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired,
  nodesLoaded: PropTypes.bool.isRequired,
  stacksLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  contentView: getFilterByName(state, 'nodesToolbar').get(
    'contentView',
    'list'
  ),
  isRegistering: state.registerNodes.get('isRegistering'),
  fetchingNodes: state.nodes.get('isFetching'),
  nodes: getFilteredNodes(state),
  nodesInProgress: nodesInProgress(state),
  nodesLoaded: state.nodes.get('isLoaded'),
  fetchingStacks: state.stacks.isFetching,
  stacksLoaded: state.stacks.isLoaded
});

const mapDispatchToProps = dispatch => ({
  fetchNodes: () => dispatch(NodesActions.fetchNodes()),
  fetchStacks: () => dispatch(StacksActions.fetchStacks()),
  fetchNodeIntrospectionData: nodeId =>
    dispatch(NodesActions.fetchNodeIntrospectionData(nodeId))
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Nodes));
