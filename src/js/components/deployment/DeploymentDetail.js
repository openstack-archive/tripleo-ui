import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import DeploymentConfirmation from './DeploymentConfirmation';
import { getCurrentPlan } from '../../selectors/plans';
import { getCurrentStack } from '../../selectors/stacks';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import { allPreDeploymentValidationsSuccessful } from '../../selectors/validations';
import PlanActions from '../../actions/PlansActions';

class DeploymentDetail extends React.Component {
  render() {
    if (!this.props.currentStack) {
      return (
        <DeploymentConfirmation
          allValidationsSuccessful={this.props.allPreDeploymentValidationsSuccessful}
          currentPlan={this.props.currentPlan}
          deployPlan={this.props.deployPlan}
          environmentSummary={this.props.environmentConfigurationSummary}/>
      );
    } else if (this.props.currentStack.stack_status.match(/PROGRESS/)) {
      return (
        // TODO(jtomasek): render component DeploymentProgress
        null
      );
    } else if (this.props.currentStack.stack_status.match(/SUCCESS/)) {
      return (
        // TODO(jtomasek): render component DeploymentSuccess
        null
      );
    } else {
      return (
        // TODO(jtomasek): render component DeploymentFailure
        null
      );
    }
  }
}

DeploymentDetail.propTypes = {
  allPreDeploymentValidationsSuccessful: React.PropTypes.bool.isRequired,
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  deployPlan: React.PropTypes.func.isRequired,
  environmentConfigurationSummary: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    allPreDeploymentValidationsSuccessful: allPreDeploymentValidationsSuccessful(state),
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentDetail);
