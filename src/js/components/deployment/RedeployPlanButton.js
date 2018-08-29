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
  cancel: {
    id: 'RedeployPlanButton.cancel',
    defaultMessage: 'Cancel'
  },
  redeployPlan: {
    id: 'RedeployPlanButton.redeployPlan',
    defaultMessage: 'Redeploy plan'
  },
  redeployConfirmationQuestion: {
    id: 'RedeployPlanButton.redeployConfirmationQuestion',
    defaultMessage: 'Are you sure you want to redeploy?'
  },
  requestingRedeploy: {
    id: 'RedeployPlanButton.requestingRedeploy',
    defaultMessage: 'Requesting redeploy'
  }
});

class RedeployPlanButton extends React.Component {
  state = { show: false };

  confirmRedeploy = () => {
    this.props.startDeployment();
    this.closeModal();
  };

  closeModal = () => this.setState({ show: false });

  render() {
    const { disabled, intl: { formatMessage }, isPending } = this.props;

    return (
      <Fragment>
        <Button
          onClick={() => this.setState({ show: true })}
          bsStyle="primary"
          disabled={disabled}
        >
          <InlineLoader
            loaded={!isPending}
            content={formatMessage(messages.requestingRedeploy)}
          >
            <FormattedMessage {...messages.redeployPlan} />
          </InlineLoader>
        </Button>
        <MessageDialog
          show={this.state.show}
          onHide={this.closeModal}
          primaryAction={this.confirmRedeploy}
          secondaryAction={this.closeModal}
          primaryActionButtonContent={formatMessage(messages.redeployPlan)}
          secondaryActionButtonContent={formatMessage(messages.cancel)}
          primaryActionButtonBsStyle="primary"
          title={formatMessage(messages.redeployPlan)}
          icon={<Icon type="pf" name="info" />}
          primaryContent={
            <p className="lead">
              <FormattedMessage {...messages.redeployPlan} />
            </p>
          }
          secondaryContent={
            <p>
              <FormattedMessage {...messages.redeployConfirmationQuestion} />
            </p>
          }
          accessibleName="redeployPlanConfirmationDialog"
        />
      </Fragment>
    );
  }
}

RedeployPlanButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  startDeployment: PropTypes.func.isRequired
};
RedeployPlanButton.defaultProps = {
  disabled: false
};

export default injectIntl(RedeployPlanButton);
