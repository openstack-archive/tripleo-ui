import ClassNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import React, { PropTypes } from 'react';

const messages = defineMessages({
  provisionState: {
    id: 'NodeProvisionState.provisionStateLabel',
    defaultMessage: 'Provision State:'
  },
  maintenance: {
    id: 'NodeMaintenanceState.maintenanceWarning',
    defaultMessage: 'Maintenance'
  },
  poweringOn: {
    id: 'NodePowerState.poweringOn',
    defaultMessage: 'Powering On'
  },
  poweringOff: {
    id: 'NodePowerState.poweringOff',
    defaultMessage: 'Powering Off'
  },
  rebooting: {
    id: 'NodePowerState.rebooting',
    defaultMessage: 'Rebooting'
  },
  powerOn: {
    id: 'NodePowerState.powerOn',
    defaultMessage: 'On'
  },
  powerOff: {
    id: 'NodePowerState.powerOff',
    defaultMessage: 'Off'
  },
  unknownPowerState: {
    id: 'NodePowerState.unknownPowerState',
    defaultMessage: 'Unknown'
  }
});

export const NodeMaintenanceState = ({ maintenance }) => {
  if (maintenance) {
    return (
      <span>
        {' | '}
        <span className="pficon pficon-warning-triangle-o" />
        &nbsp;
        <FormattedMessage {...messages.maintenance} />
      </span>
    );
  }
  return null;
};
NodeMaintenanceState.propTypes = {
  maintenance: PropTypes.bool.isRequired
};

export const NodeProvisionState = ({ provisionState, targetProvisionState }) => (
  <span>
    <strong><FormattedMessage {...messages.provisionState} /></strong>&nbsp;
    {targetProvisionState
      ? <span>
          {provisionState} <span className="fa fa-long-arrow-right"/> {targetProvisionState}
        </span>
      : provisionState}
  </span>
);
NodeProvisionState.propTypes = {
  provisionState: PropTypes.string.isRequired,
  targetProvisionState: PropTypes.string
};

export class NodePowerState extends React.Component {
  renderPowerState(message) {
    const { powerState, targetPowerState } = this.props;
    const iconClass = ClassNames({
      'fa fa-power-off': true,
      'text-warning': targetPowerState,
      'text-success': powerState === 'power on',
      'text-danger': powerState === 'power off'
    });
    return (
      <span>
        <span className={iconClass} title="Power state"/>
        &nbsp;
        <FormattedMessage {...messages[message]} />
      </span>
    );
  }

  render() {
    const { powerState, targetPowerState } = this.props;
    if (targetPowerState === 'power on') {
      return this.renderPowerState('poweringOn');
    } else if (targetPowerState === 'power off') {
      return this.renderPowerState('poweringOff');
    } else if (targetPowerState === 'rebooting') {
      return this.renderPowerState('rebooting');
    } else if (powerState === 'power on') {
      return this.renderPowerState('powerOn');
    } else if (powerState === 'power off') {
      return this.renderPowerState('powerOff');
    } else {
      return this.renderPowerState('unknownPowerState');
    }
  }
}
NodePowerState.propTypes = {
  powerState: PropTypes.string.isRequired,
  targetPowerState: PropTypes.string
};
