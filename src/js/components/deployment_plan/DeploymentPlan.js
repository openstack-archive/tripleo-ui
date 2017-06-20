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
    return this.props.currentPlan ? <CurrentPlan /> : <Redirect to="/plans" />;
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
