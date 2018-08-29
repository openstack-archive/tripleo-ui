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
  constructor() {
    super();
    this.state = {
      showConfirmationModal: false
    };
  }

  confirmRedeploy() {
    this.props.redeploy();
    this.setState({ showConfirmationModal: false });
  }

  render() {
    const { intl: { formatMessage }, disabled } = this.props;

    return (
      <div>
        <button
          onClick={() => this.setState({ showConfirmationModal: true })}
          type="button"
          name="redeploy"
          disabled={disabled}
          className="link btn btn-primary"
        >
          <InlineLoader
            loaded={!disabled}
            content={formatMessage(messages.requestingRedeploy)}
            inverse
          >
            <FormattedMessage {...messages.redeployPlan} />
          </InlineLoader>
        </button>
        <ConfirmationModal
          show={this.state.showConfirmationModal}
          title={formatMessage(messages.redeployPlan)}
          question={formatMessage(messages.redeployConfirmationQuestion)}
          confirmActionName="redeploy"
          bsStyle="primary"
          onConfirm={this.confirmRedeploy.bind(this)}
          onCancel={() => this.setState({ showConfirmationModal: false })}
        />
      </div>
    );
  }
}

RedeployPlanButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  redeploy: PropTypes.func.isRequired
};

export default injectIntl(RedeployPlanButton);
