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
import React, { Fragment } from 'react';
import { Button, Icon, MessageDialog } from 'patternfly-react';

import { InlineLoader } from '../ui/Loader';

const messages = defineMessages({
  deleteDeployment: {
    id: 'DeleteDeploymentButton.deleteDeployment',
    defaultMessage: 'Delete Deployment'
  },
  cancel: {
    id: 'DeleteDeploymentButton.cancel',
    defaultMessage: 'Cancel'
  },
  deleteConfirmationQuestion: {
    id: 'DeleteDeploymentButton.deleteConfirmationQuestion',
    defaultMessage: 'Are you sure you want to delete the deployment?'
  },
  requestingDeletion: {
    id: 'DeleteDeploymentButton.requestingDeletion',
    defaultMessage: 'Requesting Deletion of Deployment'
  }
});

class DeleteDeploymentButton extends React.Component {
  state = { show: false };

  confirmDelete = () => {
    this.props.deleteDeployment();
    this.closeModal();
  };

  closeModal = () => this.setState({ show: false });

  render() {
    const { disabled, intl: { formatMessage }, isPending } = this.props;

    return (
      <Fragment>
        <Button
          onClick={() => this.setState({ show: true })}
          bsStyle="danger"
          disabled={disabled}
        >
          <InlineLoader
            loaded={!isPending}
            content={formatMessage(messages.requestingDeletion)}
          >
            <FormattedMessage {...messages.deleteDeployment} />
          </InlineLoader>
        </Button>
        <MessageDialog
          show={this.state.show}
          onHide={this.closeModal}
          primaryAction={this.confirmDelete}
          secondaryAction={this.closeModal}
          primaryActionButtonContent={formatMessage(messages.deleteDeployment)}
          secondaryActionButtonContent={formatMessage(messages.cancel)}
          primaryActionButtonBsStyle="danger"
          title={formatMessage(messages.deleteDeployment)}
          icon={<Icon type="pf" name="error-circle-o" />}
          primaryContent={
            <p className="lead">
              <FormattedMessage {...messages.deleteDeployment} />
            </p>
          }
          secondaryContent={
            <p>
              <FormattedMessage {...messages.deleteConfirmationQuestion} />
            </p>
          }
          accessibleName="deleteDeploymentConfirmationDialog"
        />
      </Fragment>
    );
  }
}

DeleteDeploymentButton.propTypes = {
  deleteDeployment: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  isPending: PropTypes.bool.isRequired
};
DeleteDeploymentButton.defaultProps = {
  disabled: false
};

export default injectIntl(DeleteDeploymentButton);
