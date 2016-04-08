import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

const statusMessages = {
  CREATE_IN_PROGRESS: 'Deployment in progress.',
  CREATE_FAILED: 'The deployment failed.',
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

  componentDidMount() {
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

  renderResult(stack, failed) {
    let statusClass = failed ? 'alert alert-danger' : 'alert alert-success';
    let iconClass = failed ? 'pficon pficon-error-circle-o' : 'pficon pficon-ok';
    let msg = statusMessages[stack.stack_status];

    return (
      <div className={statusClass}>
        <span className={iconClass}></span>
        {msg}
      </div>
    );
  }

  render() {
    let progress = !!this.props.stack.stack_status.match(/PROGRESS/);
    let failed = !!this.props.stack.stack_status.match(/FAILED/);

    if(progress) {
      return this.renderProgress(this.props.stack);
    }
    else {
      return this.renderResult(this.props.stack, failed);
    }
  }
}

DeploymentStatus.propTypes = {
  fetchStacks: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
