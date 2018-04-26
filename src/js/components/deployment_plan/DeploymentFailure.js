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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { deploymentStatusMessages } from '../../constants/DeploymentConstants';
import { getCurrentPlanDeploymentStatus } from '../../selectors/deployment';
import InlineNotification from '../ui/InlineNotification';
import { sanitizeMessage } from '../../utils';
import StacksActions from '../../actions/StacksActions';

const messages = defineMessages({
  deleteDeployment: {
    id: 'DeploymentFailure.deleteDeployment',
    defaultMessage: 'Delete Deployment'
  },
  moreDetails: {
    id: 'DeploymentFailure.moreDetails',
    defaultMessage: 'More details'
  },
  requestingDeletion: {
    id: 'DeploymentFailure.requestingDeletion',
    defaultMessage: 'Requesting Deletion of Deployment'
  }
});

class DeploymentFailure extends React.Component {
  render() {
    const {
      deploymentStatus: { status, message },
      planName,
      // deleteStack,
      intl: { formatMessage }
    } = this.props;

    return (
      <div>
        <InlineNotification
          type="error"
          title={formatMessage(deploymentStatusMessages[status], { planName })}
        >
          <p>{sanitizeMessage(message)}</p>
          <Link to={`/plans/${planName}/deployment-detail`}>
            <FormattedMessage {...messages.moreDetails} />
          </Link>
        </InlineNotification>
      </div>
    );
  }
}

DeploymentFailure.propTypes = {
  deploymentStatus: PropTypes.object.isRequired,
  intl: PropTypes.object,
  planName: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => ({
  deploymentStatus: getCurrentPlanDeploymentStatus(state)
});

const mapDispatchToProps = (dispatch, { planName }) => ({
  deleteStack: () => {
    dispatch(StacksActions.deleteStack(planName, ''));
  }
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentFailure)
);
