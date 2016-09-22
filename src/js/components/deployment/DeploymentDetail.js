import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import DeploymentConfirmation from './DeploymentConfirmation';
import { getCurrentPlan } from '../../selectors/plans';
import { getCurrentStack } from '../../selectors/stacks';
import { getPreDeploymentValidationsStatusCounts } from '../../selectors/validations';
import PlanActions from '../../actions/PlansActions';

class DeploymentDetail extends React.Component {
  render() {
    if (!this.props.currentStack) {
      return (
        <DeploymentConfirmation currentPlan={this.props.currentPlan}
                                deployPlan={this.props.deployPlan}
                                validationsCounts={this.props.validationsCounts}/>
      );
    } else if (this.props.currentStack.stack_status.match(/PROGRESS/)) {
      return (
        null
      );
    } else if (this.props.currentStack.stack_status.match(/SUCCESS/)) {
      return (
        // DeploymentSuccess
        null
      );
    } else {
      return (
        // DeploymentFailure
        null
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    validationsCounts: getPreDeploymentValidationsStatusCounts(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName))
  };
};

DeploymentDetail.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  deployPlan: React.PropTypes.func.isRequired,
  validationsCounts: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentDetail);
