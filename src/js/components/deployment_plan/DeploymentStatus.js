import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import DeploymentResult from './DeploymentResult';

const statusMessages = {
  CREATE_IN_PROGRESS: 'Deployment in progress.',
  CREATE_FAILED: 'The deployment failed.',
  CREATE_COMPLETE: 'The deployment succeeded.',
  DELETE_IN_PROGRESS: 'Deletion in progress.',
  UPDATE_IN_PROGRESS: 'Update in progress.',
  UPDATE_FAILED: 'The update failed.'
};

export default class DeploymentStatus extends React.Component {

  constructor() {
    super();
    this.state = {
      intervalId: undefined
    };
  }

  componentWillMount() {
    let intervalId = setInterval(() => {
      this.props.fetchStacks();
    }, 5000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  renderProgress(stack) {
    let msg = statusMessages[stack.stack_status];

    return (
      <div>
        <div className="progress-description">
          <div className="spinner spinner-xs spinner-inline"></div> <strong>{msg}</strong>
        </div>
        <div className="progress progress-label-top-right">
          <div className="progress-bar"
               role="progressbar"
               aria-valuenow="50"
               aria-valuemin="0"
               aria-valuemax="100"
               style={{ width: '42.7%'}}>
            <span>50%</span>
          </div>
        </div>
    </div>
    );
  }

  render() {
    let progress = !!this.props.stack.stack_status.match(/PROGRESS/);

    if (progress) {
      return this.renderProgress(this.props.stack);
    } else {
      // We have a result so let's stop polling.
      clearInterval(this.state.intervalId);
      return (
        <DeploymentResult stack={this.props.stack} />
      );
    }
  }
}

DeploymentStatus.propTypes = {
  fetchStacks: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
