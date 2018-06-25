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
import React, { Component, Fragment } from 'react';

import { getCurrentPlanName } from '../../selectors/plans';
import { getDeploymentFailures } from '../../actions/DeploymentActions';
import { Loader } from '../ui/Loader';

class DeploymentFailures extends Component {
  componentDidMount() {
    this.props.getDeploymentFailures(this.props.planName);
  }
  render() {
    const { deploymentFailures, failuresLoaded } = this.props;
    return (
      <Loader loaded={failuresLoaded}>
        <dl>
          {deploymentFailures.entrySeq().map(([node, failure]) => (
            <Fragment key={node}>
              <dt>{node}</dt>
              <dd>{failure}</dd>
            </Fragment>
          ))}
        </dl>
      </Loader>
    );
  }
}
DeploymentFailures.propTypes = {
  deploymentFailures: ImmutablePropTypes.map.isRequired,
  failuresLoaded: PropTypes.bool,
  getDeploymentFailures: PropTypes.func.isRequired,
  planName: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
  planName: getCurrentPlanName(state),
  deploymentFailures: state.deploymentFailures.failures,
  failuresLoaded: state.deploymentFailures.loaded
});
const mapDispatchToProps = dispatch => ({
  getDeploymentFailures: planName => dispatch(getDeploymentFailures(planName))
});
export default connect(mapStateToProps, mapDispatchToProps)(DeploymentFailures);
