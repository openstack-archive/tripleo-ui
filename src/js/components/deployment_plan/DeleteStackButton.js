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

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import { ConfirmationModal } from '../ui/Modals';
import { InlineLoader } from '../ui/Loader';

const messages = defineMessages({
  deleteDeployment: {
    id: 'DeleteStackButton.deleteDeployment',
    defaultMessage: 'Delete Deployment'
  },
  deleteConfirmationQuestion: {
    id: 'DeleteStackButton.deleteConfirmationQuestion',
    defaultMessage: 'Are you sure you want to delete the deployment?'
  },
  requestingDeletion: {
    id: 'DeploymentSuccess.requestingDeletion',
    defaultMessage: 'Requesting Deletion of Deployment'
  }
});

class DeleteStackButton extends React.Component {
  constructor() {
    super();
    this.state = {
      showDeleteModal: false
    };
  }

  confirmDelete() {
    this.props.deleteStack();
    this.setState({ showDeleteModal: false });
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <button
          onClick={() => this.setState({ showDeleteModal: true })}
          type="button"
          name="delete"
          disabled={this.props.disabled}
          className="link btn btn-danger"
        >
          <InlineLoader
            loaded={this.props.loaded}
            content={formatMessage(messages.requestingDeletion)}
            inverse
          >
            <FormattedMessage {...messages.deleteDeployment} />
          </InlineLoader>
        </button>
        <ConfirmationModal
          show={this.state.showDeleteModal}
          title={formatMessage(messages.deleteDeployment)}
          question={formatMessage(messages.deleteConfirmationQuestion)}
          confirmActionName="delete"
          onConfirm={this.confirmDelete.bind(this)}
          onCancel={() => this.setState({ showDeleteModal: false })}
        />
      </div>
    );
  }
}

DeleteStackButton.propTypes = {
  deleteStack: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  loaded: PropTypes.bool.isRequired
};

export default injectIntl(DeleteStackButton);
