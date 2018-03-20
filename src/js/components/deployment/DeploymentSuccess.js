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
import { ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import OvercloudInfo from './OvercloudInfo';

class DeploymentSuccess extends React.Component {
  render() {
    const status = this.props.intl.formatMessage(
      deploymentStatusMessages[this.props.stack.stack_status]
    );

    return (
      <ModalBody className="flex-container flex-column">
        <InlineNotification type="success" title={status}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <OvercloudInfo
          overcloudInfo={this.props.overcloudInfo}
          stack={this.props.stack}
          stackResources={this.props.stackResources}
        />
      </ModalBody>
    );
  }
}

DeploymentSuccess.propTypes = {
  intl: PropTypes.object,
  overcloudInfo: ImmutablePropTypes.map.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired
};

export default injectIntl(DeploymentSuccess);
