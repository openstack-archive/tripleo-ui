import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Loader from '../../components/ui/Loader';
import { deploymentStatusMessages } from '../../constants/StacksConstants';

export default class DeploymentResult extends React.Component {

  componentDidMount() {
    this.props.fetchResource(this.props.stack, 'PublicVirtualIP');
    this.props.fetchEnvironment(this.props.stack);
  }

  render() {
    let failed = !!this.props.stack.stack_status.match(/FAILED/);
    let statusClass = failed ? 'alert alert-danger' : 'alert alert-success';
    let iconClass = failed ? 'pficon pficon-error-circle-o' : 'pficon pficon-ok';
    let msg = deploymentStatusMessages[this.props.stack.stack_status];

    let loaded = !this.props.stack.resources.isEmpty();
    let ip = this.props.stack.resources.getIn([
      'PublicVirtualIP', 'attributes', 'ip_address'
    ]);

    let password = this.props.stack.getIn([
      'environment', 'parameter_defaults', 'AdminPassword'
    ]);

    // TODO(honza) add SSL

    return (
      <div className={statusClass}>
        <span className={iconClass}></span>
        {msg}
        <br/>
        {this.props.stack.stack_status_reason}
        <Loader loaded={loaded} content="Loading overcloud information...">
          <div>
            <ul>
              <li>IP address: <a href={`http://${ip}`}>http://{ip}</a></li>
              <li>Password: {password}</li>
            </ul>
          </div>
        </Loader>
      </div>
    );
  }

}

DeploymentResult.propTypes = {
  fetchEnvironment: React.PropTypes.func.isRequired,
  fetchResource: React.PropTypes.func.isRequired,
  fetchResources: React.PropTypes.func.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};
