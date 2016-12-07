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

import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import DeleteStackButton from './DeleteStackButton';
import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import OvercloudInfo from '../deployment/OvercloudInfo';

const messages = defineMessages({
  deleteDeployment: {
    id: 'DeploymentSuccess.deleteDeployment',
    defaultMessage: 'Delete Deployment'
  },
  requestingDeletion: {
    id: 'DeploymentSuccess.requestingDeletion',
    defaultMessage: 'Requesting Deletion of Deployment'
  }
});

class DeploymentSuccess extends React.Component {
  componentDidMount() {
    this.props.fetchStackResource(this.props.stack, 'PublicVirtualIP');
    this.props.fetchStackEnvironment(this.props.stack);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const status = formatMessage(
      deploymentStatusMessages[this.props.stack.stack_status]
    );

    return (
      <div>
        <InlineNotification type="success" title={status}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <OvercloudInfo
          overcloudInfo={this.props.overcloudInfo}
          stack={this.props.stack}
          stackResources={this.props.stackResources}
        />
        <DeleteStackButton
          content={formatMessage(messages.deleteDeployment)}
          deleteStack={this.props.deleteStack}
          disabled={this.props.isRequestingStackDelete}
          loaded={!this.props.isRequestingStackDelete}
          loaderContent={formatMessage(messages.requestingDeletion)}
          stack={this.props.stack}
        />
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  deleteStack: PropTypes.func.isRequired,
  fetchStackEnvironment: PropTypes.func.isRequired,
  fetchStackResource: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isRequestingStackDelete: PropTypes.bool,
  overcloudInfo: ImmutablePropTypes.map.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired
};

export default injectIntl(DeploymentSuccess);
