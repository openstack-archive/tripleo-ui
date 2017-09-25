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

    const iconClass = ClassNames({
      'pficon pficon-server': true,
      running: inProgress
    });
    return (
      <ListViewItem
        expanded={this.state.expanded}
        stacked
        className="NodeListItem__listViewItem"
      >
        <ListViewItemHeader toggleExpanded={this.toggleExpanded.bind(this)}>
          <ListViewExpand
            expanded={this.state.expanded}
            className="NodeListItem__listViewExpand"
          />
          <ListViewCheckbox
            className="NodeListItem__listViewCheckbox"
            disabled={inProgress}
            name={`values.${node.get('uuid')}`}
          />
          {node.getIn(['introspectionStatus', 'state']) === 'finished' &&
            <ListViewActions>
              <DropdownKebab id={`${node.get('uuid')}Actions`} pullRight>
                <MenuItemLink to={`/nodes/${node.get('uuid')}/drives`}>
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
                <ListViewDescriptionHeading className="NodeListItem__nodeName">
                  {node.get('name') || node.get('uuid')}
                </ListViewDescriptionHeading>
                <ListViewDescriptionText>
                  <NodePowerState
                    className="NodeListItem__nodePowerState"
                    powerState={node.get('power_state')}
                    targetPowerState={node.get('target_power_state')}
                  />
                  <NodeMaintenanceState
                    className="NodeListItem__nodeMaintenanceState"
                    maintenance={node.get('maintenance')}
                    reason={node.get('maintenance_reason')}
                  />
                  {' | '}
                  <NodeIntrospectionStatus
                    className="NodeListItem__nodeIntrospectionStatus"
                    status={node.get('introspectionStatus').toJS()}
                  />
                  {' | '}
                  <NodeProvisionState
                    className="NodeListItem__nodeProvisionState"
                    provisionState={node.get('provision_state')}
                    targetProvisionState={node.get('target_provision_state')}
                  />
                </ListViewDescriptionText>
              </ListViewDescription>
              <ListViewAdditionalInfo>
                <ListViewAdditionalInfoItem className="NodeListItem__profile">
                  <span className="pficon pficon-flavor" />
                  <FormattedMessage {...messages.profile} />
                  &nbsp;
                  {parseNodeCapabilities(
                    node.getIn(['properties', 'capabilities'])
                  ).profile || '-'}
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem className="NodeListItem__cpuCount">
                  <span className="pficon pficon-cpu" />
                  <strong>{node.getIn(['properties', 'cpus'], '-')}</strong>
                  &nbsp;
                  <FormattedMessage
                    {...messages.cpuCores}
                    values={{ cpuCores: node.getIn(['properties', 'cpus']) }}
                  />
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem className="NodeListItem__memorySize">
                  <span className="pficon pficon-memory" />
                  <strong>
                    {node.getIn(['properties', 'memory_mb'], '-')}
                  </strong>
                  &nbsp;
                  <FormattedMessage {...messages.ram} />
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem className="NodeListItem__diskSize">
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
