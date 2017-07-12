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
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import DropdownKebab from '../../ui/dropdown/DropdownKebab';
import {
  ListViewActions,
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
import MenuItemLink from '../../ui/dropdown/MenuItemLink';
import NodeExtendedInfo from './NodeExtendedInfo';
import {
  NodeIntrospectionStatus,
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
  },
  manageDrives: {
    id: 'NodeListItem.actions.manageDrives',
    defaultMessage: 'Manage Drives'
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
    const nodeUUID = node.get('uuid');

    const iconClass = ClassNames({
      'pficon pficon-server': true,
      running: inProgress
    });
    return (
      <ListViewItem expanded={this.state.expanded} stacked>
        <ListViewItemHeader toggleExpanded={this.toggleExpanded.bind(this)}>
          <ListViewExpand
            expanded={this.state.expanded}
            id={`NodeListItem__expand_${nodeUUID}`}
          />
          <ListViewCheckbox
            id={`NodeListItem__checkbox_${nodeUUID}`}
            disabled={inProgress}
            name={`values.${nodeUUID}`}
          />
          {node.getIn(['introspectionStatus', 'state']) === 'finished' &&
            <ListViewActions>
              <DropdownKebab id={`${nodeUUID}Actions`} pullRight>
                <MenuItemLink to={`/nodes/${nodeUUID}/drives`}>
                  <FormattedMessage {...messages.manageDrives} />
                </MenuItemLink>
              </DropdownKebab>
            </ListViewActions>}
          <ListViewMainInfo>
            <ListViewLeft>
              <ListViewIcon size="sm" icon={iconClass} />
            </ListViewLeft>
            <ListViewBody>
              <ListViewDescription>
                <ListViewDescriptionHeading
                  id={`NodeListItem__nodeName_${nodeUUID}`}
                >
                  {node.get('name') || nodeUUID}
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
                  <NodeIntrospectionStatus
                    status={node.get('introspectionStatus').toJS()}
                  />
                  {' | '}
                  <NodeProvisionState
                    provisionState={node.get('provision_state')}
                    targetProvisionState={node.get('target_provision_state')}
                  />
                </ListViewDescriptionText>
              </ListViewDescription>
              <ListViewAdditionalInfo>
                <ListViewAdditionalInfoItem
                  id={`NodeListItem__nodeProfile_${nodeUUID}`}
                >
                  <span className="pficon pficon-flavor" />
                  <FormattedMessage {...messages.profile} />
                  &nbsp;
                  {parseNodeCapabilities(
                    node.getIn(['properties', 'capabilities'])
                  ).profile || '-'}
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem
                  id={`NodeListItem__cpuCount_${nodeUUID}`}
                >
                  <span className="pficon pficon-cpu" />
                  <strong>{node.getIn(['properties', 'cpus'], '-')}</strong>
                  &nbsp;
                  <FormattedMessage
                    {...messages.cpuCores}
                    values={{ cpuCores: node.getIn(['properties', 'cpus']) }}
                  />
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem
                  id={`NodeListItem__memorySize_${nodeUUID}`}
                >
                  <span className="pficon pficon-memory" />
                  <strong>
                    {node.getIn(['properties', 'memory_mb'], '-')}
                  </strong>
                  &nbsp;
                  <FormattedMessage {...messages.ram} />
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem
                  id={`NodeListItem__diskSize_${nodeUUID}`}
                >
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
