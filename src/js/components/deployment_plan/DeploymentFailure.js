import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

import DeleteStackButton from './DeleteStackButton';
import InlineNotification from '../ui/InlineNotification';
import { deploymentStatusMessages } from '../../constants/StacksConstants';

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
    const { formatMessage } = this.props.intl;
    const status = formatMessage(
      deploymentStatusMessages[this.props.stack.stack_status]);

    return (
      <div>
        <InlineNotification type="error"
                            title={status}>
          <p>
            {this.props.stack.stack_status_reason} <Link to="/deployment-plan/deployment-detail">
            <FormattedMessage {...messages.moreDetails}/></Link>
          </p>
        </InlineNotification>
        <DeleteStackButton content={formatMessage(messages.deleteDeployment)}
                           deleteStack={this.props.deleteStack}
                           disabled={this.props.isRequestingStackDelete}
                           loaded={!this.props.isRequestingStackDelete}
                           loaderContent={formatMessage(messages.requestingDeletion)}
                           stack={this.props.stack}/>
      </div>
    );
  }
}

DeploymentFailure.propTypes = {
  deleteStack: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isRequestingStackDelete: PropTypes.bool,
  stack: ImmutablePropTypes.record.isRequired
};

export default injectIntl(DeploymentFailure);
