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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import StackResourcesTable from './StackResourcesTable';

const messages = defineMessages({
  resources: {
    id: 'DeploymentFailure.resources',
    defaultMessage: 'Resources'
  }
});

class DeploymentFailure extends React.Component {
  componentDidMount() {
    this.props.fetchStackResources(this.props.stack);
  }

  render() {
    const status = this.props.intl.formatMessage(
      deploymentStatusMessages[this.props.stack.stack_status]
    );

    return (
      <ModalBody className="flex-container">
        <InlineNotification type="error" title={status}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <h2>
          <FormattedMessage {...messages.resources} />
        </h2>
        <div className="flex-column">
          <StackResourcesTable
            isFetchingResources={!this.props.stackResourcesLoaded}
            resources={this.props.stackResources.reverse()}
          />
        </div>
      </ModalBody>
    );
  }
}

DeploymentFailure.propTypes = {
  fetchStackResources: PropTypes.func.isRequired,
  intl: PropTypes.object,
  planName: PropTypes.string.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: PropTypes.bool.isRequired
};

export default injectIntl(DeploymentFailure);
