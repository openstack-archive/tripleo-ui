import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import React from 'react';

import ParameterInputList from '../parameters/ParameterInputList';
import { getRoleResourceTree } from '../../selectors/parameters';
import { getRole } from '../../selectors/roles';

class RoleParameters extends React.Component {
  render() {
    return (
      <div className="col-sm-12">
        <ParameterInputList
          parameters={this.props.parameters}
          mistralParameters={this.props.mistralParameters}/>
      </div>
    );
  }
}
RoleParameters.propTypes = {
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map,
  params: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRoleResourceTree(state, props.params.roleIdentifier).get('parameters', Map()),
    role: getRole(state, props.params.roleIdentifier)
  };
}

export default connect(mapStateToProps)(RoleParameters);
