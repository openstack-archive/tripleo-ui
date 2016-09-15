import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StackActions from '../../actions/StacksActions';
import { connect } from 'react-redux';
import Loader from '../../components/ui/Loader';

const statusMessages = {
  CREATE_IN_PROGRESS: 'Deployment in progress.',
  CREATE_FAILED: 'The deployment failed.',
  CREATE_COMPLETE: 'The deployment succeeded.',
  DELETE_IN_PROGRESS: 'Deletion in progress.',
  UPDATE_IN_PROGRESS: 'Update in progress.',
  UPDATE_FAILED: 'The update failed.'
};

class DeploymentResult extends React.Component {

  componentDidMount() {
    this.props.getOvercloudInfo(this.props.stack);
  }

  formatOvercloudInfo(overcloud) {
    let {href, password} = overcloud;
    return (
      <div>
        <ul>
          <li>IP address: <a href={`http://${href}`}>http://{href}</a></li>
          <li>Password: {password}</li>
        </ul>
      </div>
    );
  }

  render() {
    let failed = !!this.props.stack.stack_status.match(/FAILED/);
    let statusClass = failed ? 'alert alert-danger' : 'alert alert-success';
    let iconClass = failed ? 'pficon pficon-error-circle-o' : 'pficon pficon-ok';
    let msg = statusMessages[this.props.stack.stack_status];

    let info = !this.props.overcloud.isEmpty() ?
               this.formatOvercloudInfo(this.props.overcloud.toJS()) : null;

    return (
      <div className={statusClass}>
        <span className={iconClass}></span>
        {msg}
        <Loader
          loaded={!this.props.overcloud.isEmpty()}
          content="Loading overcloud information...">
          {info}
        </Loader>
      </div>
    );
  }

}

DeploymentResult.propTypes = {
  getOvercloudInfo: React.PropTypes.func.isRequired,
  overcloud: ImmutablePropTypes.map.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};

export function mapStateToProps(state) {
  return {
    stacks: state.stacks,
    overcloud: state.stacks.overcloud
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOvercloudInfo: stack => dispatch(StackActions.getOvercloudInfo(stack))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentResult);
