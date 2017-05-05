import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { ListView } from '../../ui/ListView';
import NodeListItem from './NodeListItem';

export default class NodesListView extends React.Component {
  render() {
    return (
      <ListView>
        {this.props.nodes.toList().toJS().map(node => (
          <NodeListItem
            node={node}
            key={node.uuid}
            inProgress={this.props.nodesInProgress.includes(node.uuid)} />
        ))}
      </ListView>
    );
  }
}
NodesListView.propTypes = {
  nodes: ImmutablePropTypes.map.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired
};
