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

const messages = defineMessages({
  introspectionState: {
    id: 'NodeIntrospectionState.introspectionStateLabel',
    defaultMessage: 'Introspection:'
  },
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

export const NodeMaintenanceState = ({ maintenance, reason }) => {
  if (maintenance) {
    return (
      <span title={reason} id="NodeStates__maintenanceState">
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
  maintenance: PropTypes.bool.isRequired,
  reason: PropTypes.string
};
NodeMaintenanceState.defaultProps = {
  reason: ''
};

export const NodeProvisionState = ({
  provisionState,
  targetProvisionState
}) => (
  <span id="NodeStates__provisionState">
    <strong><FormattedMessage {...messages.provisionState} /></strong>&nbsp;
    {targetProvisionState
      ? <span>
          {provisionState}
          {' '}
          <span className="fa fa-long-arrow-right" />
          {' '}
          {targetProvisionState}
        </span>
      : provisionState}
  </span>
);
NodeProvisionState.propTypes = {
  provisionState: PropTypes.string.isRequired,
  targetProvisionState: PropTypes.string
};

export const NodeIntrospectionStatus = ({
  status: { finished, state, error }
}) => (
  <span title={error} id="NodeStates__introspectionStatus">
    <strong><FormattedMessage {...messages.introspectionState} /></strong>&nbsp;
    {state}
  </span>
);
NodeIntrospectionStatus.propTypes = {
  status: PropTypes.object.isRequired
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
      <span id="NodeStates__powerState">
        <span className={iconClass} title="Power state" />
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
  powerState: PropTypes.string,
  targetPowerState: PropTypes.string
};
