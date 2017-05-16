import ClassNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

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
    const { node, inProgress } = this.props;

    const iconClass = ClassNames({
      'pficon pficon-server': true,
      running: inProgress
    });

    return (
      <ListViewItem expanded={this.state.expanded} stacked>
        <ListViewItemHeader>
          <ListViewExpand
            expanded={this.state.expanded}
            toggleExpanded={this.toggleExpanded.bind(this)}
          />
          <ListViewCheckbox
            disabled={inProgress}
            name={`values.${node.uuid}`}
          />
          <ListViewMainInfo>
            <ListViewLeft>
              <ListViewIcon size="sm" icon={iconClass} />
            </ListViewLeft>
            <ListViewBody>
              <ListViewDescription>
                <ListViewDescriptionHeading>
                  {node.name || node.uuid}
                </ListViewDescriptionHeading>
                <ListViewDescriptionText>
                  <NodePowerState
                    powerState={node.power_state}
                    targetPowerState={node.target_power_state}
                  />
                  <NodeMaintenanceState
                    maintenance={node.maintenance}
                    reason={node.maintenance_reason}
                  />
                  {' | '}
                  <NodeProvisionState
                    provisionState={node.provision_state}
                    targetProvisionState={node.target_provision_state}
                  />
                </ListViewDescriptionText>
              </ListViewDescription>
              <ListViewAdditionalInfo>
                <ListViewAdditionalInfoItem>
                  <span className="pficon pficon-flavor" />
                  <FormattedMessage {...messages.profile} />
                  &nbsp;
                  {parseNodeCapabilities(node.properties.capabilities)
                    .profile || '-'}
                </ListViewAdditionalInfoItem>
                <ListViewAdditionalInfoItem>
                  <span className="pficon pficon-cpu" />
                  <strong>{node.properties.cpus || '-'}</strong>
                  &nbsp;
                  <FormattedMessage
                    {...messages.cpuCores}
                    values={{ cpuCores: node.properties.cpus }}
                  />
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
        </ListViewItemHeader>
        <ListViewItemContainer
          onClose={this.toggleExpanded.bind(this)}
          expanded={this.state.expanded}
        >
          <NodeExtendedInfo node={node} />
        </ListViewItemContainer>
      </ListViewItem>
    );
  }
}
NodeListItem.propTypes = {
  inProgress: PropTypes.bool.isRequired,
  node: PropTypes.object.isRequired
};
