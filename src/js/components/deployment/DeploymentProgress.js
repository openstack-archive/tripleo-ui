import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import { deploymentStatusMessages as statusMessages,
         stackStates } from '../../constants/StacksConstants';
import Loader from '../ui/Loader';
import ProgressBar from '../ui/ProgressBar';
import StackResourcesTable from './StackResourcesTable';

const messages = defineMessages({
  resources: {
    id: 'DeploymentSuccess.resources',
    defaultMessage: 'Resources'
  }
});

export default class DeploymentProgress extends React.Component {
  componentDidMount() {
    this.props.fetchStackResources(this.props.stack);
  }

  renderProgressBar() {
    return (
      this.props.stack.stack_status === stackStates.CREATE_IN_PROGRESS ? (
        <ProgressBar value={this.props.deploymentProgress}
                     label={this.props.deploymentProgress + '%'}
                     labelPosition="topRight"/>
      ) : null
    );
  }

  render() {
    const statusMessage = (
      <strong>
        <FormattedMessage {...statusMessages[this.props.stack.stack_status]} />
      </strong>
    );

    return (
      <div className="col-sm-12 fixed-container-body-content">
        <div className="progress-description">
          <Loader loaded={false} content={statusMessage} inline/>
        </div>
        {this.renderProgressBar()}
        <h2><FormattedMessage {...messages.resources}/></h2>
        <StackResourcesTable isFetchingResources={!this.props.stackResourcesLoaded}
                             resources={this.props.stackResources.reverse()}/>
      </div>
    );
  }
}

DeploymentProgress.propTypes = {
  deploymentProgress: PropTypes.number.isRequired,
  fetchStackResources: PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired,
  stackResources: ImmutablePropTypes.map.isRequired,
  stackResourcesLoaded: PropTypes.bool.isRequired
};
