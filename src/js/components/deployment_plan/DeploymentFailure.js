import { injectIntl } from 'react-intl';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

import common from '../../messages/common';
import DeleteStackButton from './DeleteStackButton';
import InlineNotification from '../ui/InlineNotification';
import { deploymentStatusMessages } from '../../constants/StacksConstants';

class DeploymentFailure extends React.Component {
  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <InlineNotification type="error"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>
            {this.props.stack.stack_status_reason} <Link to="/deployment-plan/deployment-detail">
            More details</Link>
          </p>
        </InlineNotification>
        <DeleteStackButton content={formatMessage(common.deleteDeployment)}
                           deleteStack={this.props.deleteStack}
                           disabled={this.props.isRequestingStackDelete}
                           loaded={!this.props.isRequestingStackDelete}
                           loaderContent={formatMessage(common.requestingDeletionOfDeployment)}
                           stack={this.props.stack}/>
      </div>
    );
  }
}

DeploymentFailure.propTypes = {
  deleteStack: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object,
  isRequestingStackDelete: React.PropTypes.bool,
  stack: ImmutablePropTypes.record.isRequired
};

export default injectIntl(DeploymentFailure);
