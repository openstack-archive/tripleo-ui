import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NodesTable from './NodesTable';

export default class RegisteredNodesTabPane extends React.Component {
  getTableActions() {
    const dataOperationInProgress = this.props.nodes.get('dataOperationInProgress');
    return (
      <div className="btn-group">
        <button className="btn btn-default"
                type="button"
                disabled={dataOperationInProgress}
                onClick={e => {
                  e.preventDefault();
                  this.props.introspectNodes();
                }}>
          Introspect Nodes
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <NodesTable nodes={this.props.nodes.get('registered')}
                    roles={this.props.roles}
                    dataOperationInProgress={this.props.nodes.get('dataOperationInProgress')}
                    isFetchingNodes={this.props.nodes.get('isFetching')}
                    tableActions={this.getTableActions.bind(this)}/>
        {this.props.children}
      </div>
    );
  }
}
RegisteredNodesTabPane.propTypes = {
  children: React.PropTypes.node,
  introspectNodes: React.PropTypes.func,
  nodes: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map
};
