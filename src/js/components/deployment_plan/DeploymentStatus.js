import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import DeploymentResult from './DeploymentResult';

import { deploymentStatusMessages as statusMessages } from '../../constants/StacksConstants';

export default class DeploymentStatus extends React.Component {

  constructor() {
    super();
    this.state = {
      intervalId: undefined,
      progressBarWidth: '0%'
    };
  }

  componentWillMount() {
    let intervalId = setInterval(() => {
      this.props.fetchStacks();
      this.props.fetchResources(this.props.stack);
    }, 5000);
    this.setState({ intervalId: intervalId });
  }

  componentWillReceiveProps(nextProps) {
    let all = nextProps.stack.resources.size;
    if(all > 0) {
      let complete = nextProps.stack.resources.filter((item) => {
        return item.get('resource_status') === 'CREATE_COMPLETE';
      }).size;
      this.setState({ progressBarWidth: Math.ceil(complete / all * 100) + '%' });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  renderProgress(stack, state) {
    let msg = statusMessages[stack.stack_status];

    let progressBar = stack.stack_status === 'CREATE_IN_PROGRESS' ? (
      <div className="progress progress-label-top-right">
        <div className="progress-bar"
              role="progressbar"
              aria-valuenow="50"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: state.progressBarWidth }}>
          <span>{state.progressBarWidth}</span>
        </div>
      </div>
    ) : null;

    return (
      <div>
        <div className="progress-description">
          <div className="spinner spinner-xs spinner-inline"></div> <strong>{msg}</strong>
        </div>
        {progressBar}
      </div>
    );
  }

  render() {
    let progress = !!this.props.stack.stack_status.match(/PROGRESS/);

    if (progress) {
      return this.renderProgress(this.props.stack, this.state);
    } else {
      // We have a result so let's stop polling.
      clearInterval(this.state.intervalId);
      return (
        <DeploymentResult stack={this.props.stack}
          fetchResources={this.props.fetchResources}
          fetchResource={this.props.fetchResource}
          fetchEnvironment={this.props.fetchEnvironment}
        />
      );
    }
  }
}

DeploymentStatus.propTypes = {
  fetchEnvironment: React.PropTypes.func.isRequired,
  fetchResource: React.PropTypes.func.isRequired,
  fetchResources: React.PropTypes.func.isRequired,
  fetchStacks: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
