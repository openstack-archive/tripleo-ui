import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import ParameterInputList from '../parameters/ParameterInputList';
import { getRoleNetworkConfig } from '../../selectors/parameters';
import { getRole } from '../../selectors/roles';

class RoleNetworkConfig extends React.Component {
  render() {
    return (
      <div className="col-sm-12">
        <fieldset>{this.props.description}</fieldset>
        <ParameterInputList
          parameters={this.props.parameters}
          mistralParameters={this.props.mistralParameters}/>
      </div>
    );
  }
}
RoleNetworkConfig.propTypes = {
  description: React.PropTypes.string,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: React.PropTypes.array,
  params: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    description: getRoleNetworkConfig(state, props.params.roleIdentifier).description,
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRoleNetworkConfig(state, props.params.roleIdentifier).parameters.toArray(),
    role: getRole(state, props.params.roleIdentifier)
  };
}

export default connect(mapStateToProps)(RoleNetworkConfig);
