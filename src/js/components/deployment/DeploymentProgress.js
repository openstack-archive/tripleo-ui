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

import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import {
  deploymentStatusMessages as statusMessages,
  stackStates
} from '../../constants/StacksConstants';
import { InlineLoader } from '../ui/Loader';
import ProgressBar from '../ui/ProgressBar';
import StackResourcesTable from './StackResourcesTable';

const messages = defineMessages({
  resources: {
    id: 'DeploymentSuccess.resources',
    defaultMessage: 'Resources'
  }
});

export default class DeploymentProgress extends React.Component {
  componentDidMount() {
    this.props.fetchStackResources(this.props.stack);
  }

  renderProgressBar() {
    return this.props.stack.stack_status === stackStates.CREATE_IN_PROGRESS
      ? <ProgressBar
          value={this.props.deploymentProgress}
          label={this.props.deploymentProgress + '%'}
          labelPosition="topRight"
        />
      : null;
  }

  render() {
    const statusMessage = (
      <strong>
        <FormattedMessage {...statusMessages[this.props.stack.stack_status]} />
      </strong>
    );

    return (
      <div className="col-sm-12 fixed-container-body-content">
        <div className="progress-description">
          <InlineLoader content={statusMessage} />
        </div>
        {this.renderProgressBar()}
        <h2><FormattedMessage {...messages.resources} /></h2>
        <StackResourcesTable
          isFetchingResources={!this.props.stackResourcesLoaded}
          resources={this.props.stackResources.reverse()}
        />
      </div>
    );
  }
}

DeploymentProgress.propTypes = {
  deploymentProgress: PropTypes.number.isRequired,
  fetchStackResources: PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: PropTypes.bool.isRequired
};
