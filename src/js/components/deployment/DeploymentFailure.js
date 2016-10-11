import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import StackResourcesTable from './StackResourcesTable';

export default class DeploymentSuccess extends React.Component {
  componentDidMount() {
    this.props.fetchStack(this.props.stack);
  }

  render() {
    return (
      <div className="col-sm-12">
        <InlineNotification type="error"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <h2>Resources</h2>
        <StackResourcesTable isFetchingResources={false}
                             resources={this.props.stack.resources.reverse()}/>
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  fetchStack: React.PropTypes.func.isRequired,
  planName: React.PropTypes.string.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
