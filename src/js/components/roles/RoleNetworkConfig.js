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
          mistralParameters={this.props.mistralParameters}
        />
      </div>
    );
  }
}
RoleNetworkConfig.propTypes = {
  description: PropTypes.string,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state, props) {
  return {
    description: getRoleNetworkConfig(state, props.match.params.roleName)
      .description,
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRoleNetworkConfig(state, props.match.params.roleName)
      .parameters,
    role: getRole(state, props.match.params.roleName)
  };
}

export default connect(mapStateToProps)(RoleNetworkConfig);
