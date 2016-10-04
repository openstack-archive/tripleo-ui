import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { deploymentStatusMessages as statusMessages,
         stackStates } from '../../constants/StacksConstants';
import Loader from '../ui/Loader';
import ProgressBar from '../ui/ProgressBar';

export default class DeploymentProgress extends React.Component {
  calculateProgress() {
    let allResources = this.props.stack.resources.size;
    if(allResources > 0) {
      let completeResources = this.props.stack.resources.filter(r => {
        return r.resource_status === 'CREATE_COMPLETE';
      }).size;
      return Math.ceil(completeResources / allResources * 100);
    }
    return 0;
  }

  renderProgressBar() {
    const progress = this.calculateProgress();
    return (
      this.props.stack.stack_status === stackStates.CREATE_IN_PROGRESS ? (
        <ProgressBar value={progress}
                     label={progress + '%'}
                     labelPosition="topRight"/>
      ) : null
    );
  }

  render() {
    const statusMessage = (
      <strong>{statusMessages[this.props.stack.stack_status]}</strong>
    );

    return (
      <div>
        <div className="progress-description">
          <Loader loaded={false} content={statusMessage} inline/>
        </div>
        {this.renderProgressBar()}
      </div>
    );
  }
}

DeploymentProgress.propTypes = {
  fetchStack: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
