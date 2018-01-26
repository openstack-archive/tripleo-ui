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
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { getCurrentPlanName, getPlans } from '../../selectors/plans';
import { PageHeader } from '../ui/PageHeader';
import PlansActions from '../../actions/PlansActions';
import StacksActions from '../../actions/StacksActions';
import NoPlans from './NoPlans';
import PlanCard from './cards/PlanCard';
import ImportPlanCard from './cards/ImportPlanCard';

const messages = defineMessages({
  importPlan: {
    id: 'PlansList.importPlan',
    defaultMessage: 'Import Plan'
  },
  plans: {
    id: 'PlansList.plans',
    defaultMessage: 'Plans'
  }
});

class PlansList extends React.Component {
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
          <div className="pull-right">
            <Link
              to="/plans/manage/new"
              className="btn btn-primary"
              id="ListPlans__importPlanButton"
            >
              <span className="fa fa-plus" />&nbsp;
              <FormattedMessage {...messages.importPlan} />
            </Link>
          </div>
        </PageHeader>
        {this.props.plans.isEmpty() ? (
          <NoPlans />
        ) : (
          <div className="panel panel-default">
            <div className="cards-pf">
              <div className="row row-cards-pf">
                <ImportPlanCard />
                {this.renderCards()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

PlansList.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string,
  fetchPlans: PropTypes.func,
  fetchStacks: PropTypes.func,
  plans: ImmutablePropTypes.map,
  stacks: ImmutablePropTypes.map
};

function mapStateToProps(state) {
  return {
    currentPlanName: getCurrentPlanName(state),
    plans: getPlans(state),
    stacks: state.stacks.get('stacks')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlans: () => dispatch(PlansActions.fetchPlans()),
    fetchStacks: () => dispatch(StacksActions.fetchStacks())
  };
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(PlansList)
);
