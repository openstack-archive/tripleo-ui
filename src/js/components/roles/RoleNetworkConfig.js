import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
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
          parameters={this.props.parameters.toList()}
          mistralParameters={this.props.mistralParameters}/>
      </div>
    );
  }
}
RoleNetworkConfig.propTypes = {
  description: PropTypes.string,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  params: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    description: getRoleNetworkConfig(state, props.params.roleIdentifier).description,
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRoleNetworkConfig(state, props.params.roleIdentifier).parameters,
    role: getRole(state, props.params.roleIdentifier)
  };
}

export default connect(mapStateToProps)(RoleNetworkConfig);
