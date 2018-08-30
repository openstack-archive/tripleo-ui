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

import cx from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { ListViewItem, ListViewIcon, ListViewInfoItem } from 'patternfly-react';

import DropdownKebab from '../../ui/dropdown/DropdownKebab';
import MenuItemLink from '../../ui/dropdown/MenuItemLink';
import NodeExtendedInfo from './NodeExtendedInfo';
import {
  NodeIntrospectionStatus,
  NodeMaintenanceState,
  NodePowerState,
  NodeProvisionState,
  NodeDeploymentPlan
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

export const NodeListItem = ({
  fetchNodeIntrospectionData,
  node,
  inProgress
}) => (
  <ListViewItem
    className="NodeListItem__listViewItem"
    checkboxInput={
      <Field
        className="NodeListItem__listViewCheckbox"
        name={`values.${node.get('uuid')}`}
        type="checkbox"
        component="input"
        disabled={inProgress}
        onClick={e => e.stopPropagation()} // TODO(jtomasek): probably not needed
      />
    }
    actions={
      node.getIn(['introspectionStatus', 'state']) === 'finished' && (
        <DropdownKebab id={`${node.get('uuid')}Actions`} pullRight>
          <MenuItemLink to={`/nodes/${node.get('uuid')}/drives`}>
            <FormattedMessage {...messages.manageDrives} />
          </MenuItemLink>
        </DropdownKebab>
      )
    }
    leftContent={
      <ListViewIcon
        className={cx({ running: inProgress })}
        size="sm"
        type="pf"
        name="server"
      />
    }
    heading={
      <span className="NodeListItem__nodeName">
        {node.get('name') || node.get('uuid')}
      </span>
    }
    description={
      <div>
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
        <NodeDeploymentPlan
          className="NodeListItem__nodeDeploymentPlan"
          planName={node.get('planName')}
        />
      </div>
    }
    additionalInfo={[
      <ListViewInfoItem key="profile" className="NodeListItem__profile">
        <span className="pficon pficon-flavor" />
        <FormattedMessage {...messages.profile} />
        &nbsp;
        {parseNodeCapabilities(node.getIn(['properties', 'capabilities']))
          .profile || '-'}
      </ListViewInfoItem>,
      <ListViewInfoItem key="cpus" className="NodeListItem__cpuCount">
        <span className="pficon pficon-cpu" />
        <strong>{node.getIn(['properties', 'cpus'], '-')}</strong>
        &nbsp;
        <FormattedMessage
          {...messages.cpuCores}
          values={{ cpuCores: node.getIn(['properties', 'cpus']) }}
        />
      </ListViewInfoItem>,
      <ListViewInfoItem key="memory" className="NodeListItem__memorySize">
        <span className="pficon pficon-memory" />
        <strong>{node.getIn(['properties', 'memory_mb'], '-')}</strong>
        &nbsp;
        <FormattedMessage {...messages.ram} />
      </ListViewInfoItem>,
      <ListViewInfoItem key="disk" className="NodeListItem__diskSize">
        <span className="fa fa-database" />
        <strong>{node.getIn(['properties', 'local_gb'], '-')}</strong>
        &nbsp;
        <FormattedMessage {...messages.disk} />
      </ListViewInfoItem>
    ]}
    stacked
  >
    <NodeExtendedInfo
      node={node}
      fetchNodeIntrospectionData={fetchNodeIntrospectionData}
    />
  </ListViewItem>
);
NodeListItem.propTypes = {
  fetchNodeIntrospectionData: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  node: ImmutablePropTypes.map.isRequired
};

export default NodeListItem;
