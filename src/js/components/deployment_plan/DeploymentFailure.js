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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import DeleteStackButton from './DeleteStackButton'
import InlineNotification from '../ui/InlineNotification'
import { deploymentStatusMessages } from '../../constants/StacksConstants'

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
})

class DeploymentFailure extends React.Component {
  render() {
    const {
      currentPlanName,
      deleteStack,
      intl: { formatMessage },
      isRequestingStackDelete,
      stack
    } = this.props
    const status = formatMessage(deploymentStatusMessages[stack.stack_status])

    return (
      <div>
        <InlineNotification type="error" title={status}>
          <p>
            {stack.stack_status_reason}
            {' '}
            <Link to={`/plans/${currentPlanName}/deployment-detail`}>
              <FormattedMessage {...messages.moreDetails} />
            </Link>
          </p>
        </InlineNotification>
        <DeleteStackButton
          content={formatMessage(messages.deleteDeployment)}
          deleteStack={deleteStack}
          disabled={isRequestingStackDelete}
          loaded={!isRequestingStackDelete}
          loaderContent={formatMessage(messages.requestingDeletion)}
          stack={stack}
        />
      </div>
    )
  }
}

DeploymentFailure.propTypes = {
  currentPlanName: PropTypes.string.isRequired,
  deleteStack: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isRequestingStackDelete: PropTypes.bool,
  stack: ImmutablePropTypes.record.isRequired
}

export default injectIntl(DeploymentFailure)
