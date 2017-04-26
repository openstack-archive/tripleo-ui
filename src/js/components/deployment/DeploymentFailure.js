import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import StackResourcesTable from './StackResourcesTable';

const messages = defineMessages({
  resources: {
    id: 'DeploymentFailure.resources',
    defaultMessage: 'Resources'
  }
});

class DeploymentFailure extends React.Component {
  componentDidMount() {
    this.props.fetchStackResources(this.props.stack);
  }

  render() {
    const status = this.props.intl.formatMessage(
      deploymentStatusMessages[this.props.stack.stack_status]);

    return (
      <div className="col-sm-12 fixed-container-body-content">
        <InlineNotification type="error"
                            title={status}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <h2><FormattedMessage {...messages.resources}/></h2>
        <StackResourcesTable isFetchingResources={!this.props.stackResourcesLoaded}
                             resources={this.props.stackResources.reverse()}/>
      </div>
    );
  }
}

DeploymentFailure.propTypes = {
  fetchStackResources: PropTypes.func.isRequired,
  intl: PropTypes.object,
  planName: PropTypes.string.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: PropTypes.bool.isRequired
};

export default injectIntl(DeploymentFailure);
