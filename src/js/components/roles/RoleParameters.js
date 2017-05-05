/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';

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
