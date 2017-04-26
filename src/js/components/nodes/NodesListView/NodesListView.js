import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { MenuItem } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import DropdownKebab from '../../ui/dropdown/DropdownKebab';
import { ListView,
         ListViewActions,
         ListViewAdditionalInfo,
         ListViewAdditionalInfoItem,
         ListViewBody,
         ListViewCheckbox,
         ListViewDescription,
         ListViewDescriptionHeading,
         ListViewDescriptionText,
         ListViewIcon,
         ListViewItem,
         ListViewLeft,
         ListViewMainInfo } from '../../ui/ListView';
import { NodeMaintenanceState,
         NodePowerState,
         NodeProvisionState } from './NodeStates';
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

export default class NodesListView extends Component {
  render() {
    return (
      <ListView>
        {this.props.nodes.toList().toJS().map(node => (
          <NodeListItem node={node} key={node.uuid} />
        ))}
      </ListView>
    );
  }
}
NodesListView.propTypes = {
  nodes: ImmutablePropTypes.map.isRequired
};

export class NodeListItem extends Component {
  render() {
    const { node } = this.props;
    return (
      <ListViewItem stacked>
        <ListViewCheckbox>
          <input type="checkbox"/>
        </ListViewCheckbox>
        <ListViewActions>
          <DropdownKebab id="node_<node_uuid>" pullRight>
            <MenuItem>Action</MenuItem>
            <MenuItem>Action 2</MenuItem>
          </DropdownKebab>
        </ListViewActions>
        <ListViewMainInfo>
          <ListViewLeft>
            <ListViewIcon size="sm" icon="pficon pficon-server" />
          </ListViewLeft>
          <ListViewBody>
            <ListViewDescription>
              <ListViewDescriptionHeading>
                {node.name || node.uuid}
              </ListViewDescriptionHeading>
              <ListViewDescriptionText>
                <NodePowerState
                  powerState={node.power_state}
                  targetPowerState={node.target_power_state} />
                <NodeMaintenanceState maintenance={node.maintenance} />
                {' | '}
                <NodeProvisionState
                  provisionState={node.provision_state}
                  targetProvisionState={node.target_provision_state} />
              </ListViewDescriptionText>
            </ListViewDescription>
            <ListViewAdditionalInfo>
              <ListViewAdditionalInfoItem>
                <span className="pficon pficon-flavor" />
                <FormattedMessage {...messages.profile} />
                &nbsp;
                {parseNodeCapabilities(node.properties.capabilities).profile || '-'}
              </ListViewAdditionalInfoItem>
              <ListViewAdditionalInfoItem>
                <span className="pficon pficon-cpu" />
                <strong>{node.properties.cpus || '-'}</strong>
                &nbsp;
                <FormattedMessage
                  {...messages.cpuCores}
                  values={{ cpuCores: node.properties.cpus }} />
              </ListViewAdditionalInfoItem>
              <ListViewAdditionalInfoItem>
                <span className="pficon pficon-memory" />
                <strong>{node.properties.memory_mb || '-'}</strong>
                &nbsp;
                <FormattedMessage {...messages.ram} />
              </ListViewAdditionalInfoItem>
              <ListViewAdditionalInfoItem>
                <span className="fa fa-database" />
                <strong>{node.properties.local_gb || '-'}</strong>
                &nbsp;
                <FormattedMessage {...messages.disk} />
              </ListViewAdditionalInfoItem>
            </ListViewAdditionalInfo>
          </ListViewBody>
        </ListViewMainInfo>
      </ListViewItem>
    );
  }
}
NodeListItem.propTypes = {
  node: PropTypes.object.isRequired
};
