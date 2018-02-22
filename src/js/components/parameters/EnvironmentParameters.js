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

import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import { getCurrentPlanName } from '../../selectors/plans';
import { getEnvironmentParameters } from '../../selectors/parameters';
import { getEnvironment } from '../../selectors/environmentConfiguration';
import InlineNotification from '../ui/InlineNotification';
import { Loader } from '../ui/Loader';
import ParameterInputList from './ParameterInputList';

class EnvironmentParameters extends React.Component {
  componentDidMount() {
    this.props.fetchEnvironment(
      this.props.currentPlanName,
      this.props.environment
    );
  }

  render() {
    const { environmentError, isFetchingEnvironment, parameters } = this.props;
    return (
      <Loader
        height={120}
        loaded={!isFetchingEnvironment}
        content="Loading configuration..."
      >
        {environmentError ? (
          <fieldset>
            <InlineNotification title={environmentError.title} type="error">
              {environmentError.message}
            </InlineNotification>
          </fieldset>
        ) : (
          <ParameterInputList parameters={parameters.toList()} />
        )}
      </Loader>
    );
  }
}
EnvironmentParameters.propTypes = {
  currentPlanName: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
  environmentError: ImmutablePropTypes.map,
  fetchEnvironment: PropTypes.func.isRequired,
  isFetchingEnvironment: PropTypes.bool.isRequired,
  parameters: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    currentPlanName: getCurrentPlanName(state),
    environmentError: getEnvironment(state, ownProps.environment).error,
    parameters: getEnvironmentParameters(state, ownProps.environment),
    isFetchingEnvironment: getEnvironment(state, ownProps.environment)
      .isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEnvironment: (currentPlanName, environmentFileName) => {
      dispatch(
        EnvironmentConfigurationActions.fetchEnvironment(
          currentPlanName,
          environmentFileName
        )
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  EnvironmentParameters
);
