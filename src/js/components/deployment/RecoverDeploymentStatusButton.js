/**
 * Copyright 2018 Red Hat Inc.
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

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'patternfly-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { defineMessages } from 'react-intl';

import { InlineLoader } from '../ui/Loader';

const messages = defineMessages({
  recoveringDeploymentStatus: {
    id: 'RecoverDeploymentStatusButton.recoveringDeploymentStatus',
    defaultMessage: 'Recovering deployment status'
  },
  recoverDeploymentStatus: {
    id: 'RecoverDeploymentStatusButton.recoverDeploymentStatus',
    defaultMessage: 'Recover deployment status'
  }
});
const RecoverDeploymentStatusButton = ({
  disabled,
  isPending,
  intl: { formatMessage },
  recoverDeploymentStatus
}) => (
  <Button disabled={disabled} onClick={recoverDeploymentStatus}>
    <InlineLoader
      loaded={!isPending}
      content={formatMessage(messages.recoveringDeploymentStatus)}
    >
      <FormattedMessage {...messages.recoverDeploymentStatus} />
    </InlineLoader>
  </Button>
);
RecoverDeploymentStatusButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  recoverDeploymentStatus: PropTypes.func.isRequired
};

export default injectIntl(RecoverDeploymentStatusButton);
