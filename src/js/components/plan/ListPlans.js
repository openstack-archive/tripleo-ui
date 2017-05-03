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
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import CurrentPlanActions from '../../actions/CurrentPlanActions';
import { PageHeader } from '../ui/PageHeader';
import PlansActions from '../../actions/PlansActions';
import StacksActions from '../../actions/StacksActions';
import PlanCard from './cards/PlanCard';
import CreatePlanCard from './cards/CreatePlanCard';

const messages = defineMessages({
  plans: {
    id: 'ListPlans.plans',
    defaultMessage: 'Plans'
  }
});

class ListPlans extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.fetchPlans();
    this.props.fetchStacks();
  }

  renderCard(plan) {
    const stack = this.props.stacks.get(plan.name);
    return (
      <PlanCard
        key={plan.name}
        plan={plan}
        choosePlan={this.props.choosePlan}
        currentPlanName={this.props.currentPlanName}
        stack={stack}
      />
    );
  }

  renderCards() {
    let plans = this.props.plans.toArray();
    return plans.map(plan => this.renderCard(plan));
  }

  render() {
    return (
      <div>
        <PageHeader>
          <FormattedMessage {...messages.plans} />
        </PageHeader>
        <div className="panel panel-default">
          <div className="cards-pf">
            <div className="row row-cards-pf">
              <CreatePlanCard />
              {this.renderCards()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListPlans.propTypes = {
  children: PropTypes.node,
  choosePlan: PropTypes.func,
  conflict: PropTypes.string,
  currentPlanName: PropTypes.string,
  fetchPlans: PropTypes.func,
  fetchStacks: PropTypes.func,
  plans: ImmutablePropTypes.map,
  stacks: ImmutablePropTypes.map
};

function mapStateToProps(state) {
  return {
    currentPlanName: state.currentPlan.currentPlanName,
    plans: state.plans.get('all'),
    stacks: state.stacks.get('stacks')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlans: () => dispatch(PlansActions.fetchPlans()),
    fetchStacks: () => dispatch(StacksActions.fetchStacks()),
    choosePlan: planName => dispatch(CurrentPlanActions.choosePlan(planName))
  };
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ListPlans)
);
