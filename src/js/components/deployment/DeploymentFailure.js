import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import StackResourcesTable from './StackResourcesTable';

const messages = defineMessages({
  resources: {
    id: 'DeploymentSuccess.resources',
    defaultMessage: 'Resources'
  }
});

export default class DeploymentSuccess extends React.Component {
  componentDidMount() {
    this.props.fetchStackResources(this.props.stack);
  }

  render() {
    return (
      <div className="col-sm-12 fixed-container-body-content">
        <InlineNotification type="error"
                            title={deploymentStatusMessages[this.props.stack.stack_status]}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <h2><FormattedMessage {...messages.resources}/></h2>
        <StackResourcesTable isFetchingResources={!this.props.stackResourcesLoaded}
                             resources={this.props.stackResources.reverse()}/>
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  fetchStackResources: React.PropTypes.func.isRequired,
  planName: React.PropTypes.string.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: React.PropTypes.bool.isRequired
};
