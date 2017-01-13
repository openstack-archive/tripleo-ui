import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import { getEnvironmentParameters } from '../../selectors/parameters';
import { getEnvironment } from '../../selectors/environmentConfiguration';
import InlineNotification from '../ui/InlineNotification';
import Loader from '../ui/Loader';
import ParameterInputList from './ParameterInputList';

class EnvironmentParameters extends React.Component {
  componentDidMount() {
    this.props.fetchEnvironment(this.props.currentPlanName, this.props.environment);
  }

  render() {
    const { environmentError, isFetchingEnvironment, parameters } = this.props;
    return (
      <Loader height={120}
              loaded={!isFetchingEnvironment}
              content="Fetching Parameters...">
        {environmentError
          ? <fieldset>
              <InlineNotification title={environmentError.name} type="error">
                {environmentError.message}
              </InlineNotification>
            </fieldset>
          : <ParameterInputList parameters={parameters.toList()}/>}
      </Loader>
    );
  }
}
EnvironmentParameters.propTypes = {
  currentPlanName: React.PropTypes.string.isRequired,
  environment: React.PropTypes.string.isRequired,
  environmentError: ImmutablePropTypes.map,
  fetchEnvironment: React.PropTypes.func.isRequired,
  isFetchingEnvironment: React.PropTypes.bool.isRequired,
  parameters: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    currentPlanName: state.currentPlan.currentPlanName,
    environmentError: getEnvironment(state, ownProps.environment).error,
    parameters: getEnvironmentParameters(state, ownProps.environment),
    parametersLoaded: state.parameters.loaded,
    isFetchingEnvironment: getEnvironment(state, ownProps.environment).isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEnvironment: (currentPlanName, environmentFileName) => {
      dispatch(EnvironmentConfigurationActions.fetchEnvironment(currentPlanName,
                                                                environmentFileName));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentParameters);
