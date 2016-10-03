import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

import InlineNotification from '../ui/InlineNotification';
import { deploymentStatusMessages } from '../../constants/StacksConstants';

export default class DeploymentFailure extends React.Component {
  render() {
    return (
      <InlineNotification type="error"
                          title={deploymentStatusMessages[this.props.stack.stack_status]}>
        <p>
          {this.props.stack.stack_status_reason} <Link to="/deployment-plan/deployment-detail">
          More details</Link>
        </p>
      </InlineNotification>
    );
  }
}

DeploymentFailure.propTypes = {
  stack: ImmutablePropTypes.record.isRequired
};
