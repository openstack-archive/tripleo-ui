import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import ParameterInputList from '../parameters/ParameterInputList';
import { getRoleParameters } from '../../selectors/parameters';
import { getRole } from '../../selectors/roles';

class RoleParameters extends React.Component {
  render() {
    return (
      <div className="col-sm-12">
        <ParameterInputList
          parameters={this.props.parameters.toList()}
          mistralParameters={this.props.mistralParameters}/>
      </div>
    );
  }
}
RoleParameters.propTypes = {
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  params: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRoleParameters(state, props.params.roleIdentifier),
    role: getRole(state, props.params.roleIdentifier)
  };
}

export default connect(mapStateToProps)(RoleParameters);
