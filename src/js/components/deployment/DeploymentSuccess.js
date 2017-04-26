import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { deploymentStatusMessages } from '../../constants/StacksConstants';
import InlineNotification from '../ui/InlineNotification';
import OvercloudInfo from './OvercloudInfo';

class DeploymentSuccess extends React.Component {
  render() {
    const status = this.props.intl.formatMessage(
      deploymentStatusMessages[this.props.stack.stack_status]);

    return (
      <div className="col-sm-12 fixed-container-body-content">
        <InlineNotification type="success"
                            title={status}>
          <p>{this.props.stack.stack_status_reason}</p>
        </InlineNotification>
        <OvercloudInfo stackResourcesLoaded={this.props.stackResourcesLoaded}
                       stack={this.props.stack}
                       stackResources={this.props.stackResources}/>
      </div>
    );
  }
}

DeploymentSuccess.propTypes = {
  intl: PropTypes.object,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: PropTypes.bool.isRequired
};

export default injectIntl(DeploymentSuccess);
