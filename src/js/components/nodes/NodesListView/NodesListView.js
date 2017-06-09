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
