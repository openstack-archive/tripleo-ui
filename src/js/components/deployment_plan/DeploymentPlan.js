import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import React, { Component } from 'react';

import CurrentPlanActions from '../../actions/CurrentPlanActions';
import CurrentPlan from './CurrentPlan';
import { getPlans } from '../../selectors/plans';

class DeploymentPlan extends Component {
  componentWillMount() {
    this.props.choosePlan(this.props.match.params.planName);
  }

  render() {
    if (this.props.currentPlan) {
      return <CurrentPlan />;
    } else {
      return <Redirect to="/plans" />;
    }
  }
}
DeploymentPlan.propTypes = {
  choosePlan: PropTypes.func.isRequired,
  currentPlan: ImmutablePropTypes.record,
  match: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  currentPlan: getPlans(state).get(props.match.params.planName)
});

const mapDispatchToProps = (dispatch, props) => ({
  choosePlan: planName => dispatch(CurrentPlanActions.choosePlan(planName))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan);
