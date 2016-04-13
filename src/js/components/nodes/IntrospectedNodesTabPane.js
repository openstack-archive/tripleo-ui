import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NodesTable from './NodesTable';

export default class IntrospectedNodesTabPane extends React.Component {
  render() {
    return (
      <NodesTable nodes={this.props.nodes.get('introspected')}
                  roles={this.props.roles}
                  isFetchingNodes={this.props.nodes.get('isFetching')}
                  dataOperationInProgress={this.props.nodes.get('dataOperationInProgress')}/>
    );
  }
}
IntrospectedNodesTabPane.propTypes = {
  nodes: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map
};
