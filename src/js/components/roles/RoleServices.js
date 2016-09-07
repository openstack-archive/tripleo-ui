import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import ParameterInputList from '../parameters/ParameterInputList';
import { getRoleResourceTree } from '../../selectors/parameters';
import { getRole } from '../../selectors/roles';

class RoleServices extends React.Component {
  render() {
    return (
      <div className="col-sm-12">
        <ParameterInputList
          parameters={this.props.roleResourceTree.get('parameters')}
          mistralParameters={this.props.mistralParameters}/>
      </div>
    );
  }
}
RoleServices.propTypes = {
  mistralParameters: ImmutablePropTypes.map.isRequired,
  params: React.PropTypes.object.isRequired,
  role: ImmutablePropTypes.record.isRequired,
  roleResourceTree: ImmutablePropTypes.map
};

function mapStateToProps(state, props) {
  return {
    mistralParameters: state.parameters.mistralParameters,
    roleResourceTree: getRoleResourceTree(state, props.params.roleIdentifier),
    role: getRole(state, props.params.roleIdentifier)
  };
}

export default connect(mapStateToProps)(RoleServices);
