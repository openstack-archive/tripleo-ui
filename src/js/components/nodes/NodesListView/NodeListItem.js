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

import ClassNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {
  ListViewAdditionalInfo,
  ListViewAdditionalInfoItem,
  ListViewBody,
  ListViewCheckbox,
  ListViewDescription,
  ListViewDescriptionHeading,
  ListViewDescriptionText,
  ListViewExpand,
  ListViewIcon,
  ListViewItem,
  ListViewItemContainer,
  ListViewItemHeader,
  ListViewLeft,
  ListViewMainInfo
} from '../../ui/ListView';
import NodeExtendedInfo from './NodeExtendedInfo';
import {
  NodeIntrospectionState,
  NodeMaintenanceState,
  NodePowerState,
  NodeProvisionState
} from './NodeStates';
import { parseNodeCapabilities } from '../../../utils/nodes';

const messages = defineMessages({
  profile: {
    id: 'NodeListItem.Profile',
    defaultMessage: 'Profile:'
  },
  cpuCores: {
    id: 'NodeListItem.cpuCores',
    defaultMessage: `CPU {cpuCores, plural,
      one {Core} other {Cores}}`
  },
  ram: {
    id: 'NodeListItem.mbRam',
    defaultMessage: 'MB RAM'
  },
  disk: {
    id: 'NodeListItem.gbDisk',
    defaultMessage: 'GB Disk'
  }
});

export default class NodeListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  toggleExpanded() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  render() {
    const { fetchNodeIntrospectionData, node, inProgress } = this.props;

    const iconClass = ClassNames({
      'pficon pficon-server': true,
      running: inProgress
    });

    return (
      <ListViewItem expanded={this.state.expanded} stacked>
        <ListViewItemHeader toggleExpanded={this.toggleExpanded.bind(this)}>
          <ListViewExpand expanded={this.state.expanded} />
          <ListViewCheckbox
            disabled={inProgress}
            name={`values.${node.get('uuid')}`}
          />
          <ListViewMainInfo>
            <ListViewLeft>
              <ListViewIcon size="sm" icon={iconClass} />
            </ListViewLeft>
            <ListViewBody>
              <ListViewDescription>
                <ListViewDescriptionHeading>
                  {node.get('name') || node.get('uuid')}
                </ListViewDescriptionHeading>
                <ListViewDescriptionText>
                  <NodePowerState
                    powerState={node.get('power_state')}
                    targetPowerState={node.get('target_power_state')}
                  />
                  <NodeMaintenanceState
                    maintenance={node.get('maintenance')}
                    reason={node.get('maintenance_reason')}
                  />
                  {' | '}
                  <NodeIntrospectionState
                    state={node.getIn(['introspectionStatus', 'state'])}
                  />
                  {' | '}
                  <NodeProvisionState
                    provisionState={node.get('provision_state')}
                    targetProvisionState={node.get('target_provision_state')}
                  />
                </ListViewDescriptionText>
              </ListViewDescription>
              <ListViewAdditionalInfo>
                <ListViewAdditionalInfoItem>
                  <span className="pficon pficon-flavor" />
                  <FormattedMessage {...messages.profile} />
                  &nbsp;
                  {parseNodeCapabilities(
                    node.getIn(['properties', 'capabilities'])
                  ).profile || '-'}
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem>
                  <span className="pficon pficon-cpu" />
                  <strong>{node.getIn(['properties', 'cpus'], '-')}</strong>
                  &nbsp;
                  <FormattedMessage
                    {...messages.cpuCores}
                    values={{ cpuCores: node.getIn(['properties', 'cpus']) }}
                  />
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem>
                  <span className="pficon pficon-memory" />
                  <strong>
                    {node.getIn(['properties', 'memory_mb'], '-')}
                  </strong>
                  &nbsp;
                  <FormattedMessage {...messages.ram} />
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem>
                  <span className="fa fa-database" />
                  <strong>{node.getIn(['properties', 'local_gb'], '-')}</strong>
                  &nbsp;
                  <FormattedMessage {...messages.disk} />
                </ListViewAdditionalInfoItem>
              </ListViewAdditionalInfo>
            </ListViewBody>
          </ListViewMainInfo>
        </ListViewItemHeader>
        <ListViewItemContainer
          onClose={this.toggleExpanded.bind(this)}
          expanded={this.state.expanded}
        >
          <NodeExtendedInfo
            node={node}
            fetchNodeIntrospectionData={fetchNodeIntrospectionData}
          />
        </ListViewItemContainer>
      </ListViewItem>
    );
  }
}
NodeListItem.propTypes = {
  fetchNodeIntrospectionData: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  node: ImmutablePropTypes.map.isRequired
};
