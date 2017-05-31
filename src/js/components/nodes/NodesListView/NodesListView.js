import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import { ListView } from '../../ui/ListView';
import NodeListItem from './NodeListItem';

export default class NodesListView extends React.Component {
  render() {
    return (
      <ListView>
        {this.props.nodes
          .toList()
          .map(node => (
            <NodeListItem
              fetchNodeIntrospectionData={this.props.fetchNodeIntrospectionData}
              node={node}
              key={node.get('uuid')}
              inProgress={this.props.nodesInProgress.includes(node.get('uuid'))}
            />
          ))}
      </ListView>
    );
  }
}
NodesListView.propTypes = {
  fetchNodeIntrospectionData: PropTypes.func.isRequired,
  nodes: ImmutablePropTypes.map.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired
};
