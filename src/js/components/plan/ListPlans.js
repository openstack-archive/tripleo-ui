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

  render() {
    let plans = this.props.plans.sortBy(plan => plan.name).toArray();
    let cards = plans.map(plan => this.renderCard(plan));
    return (
      <div>
        <PageHeader>
          <FormattedMessage {...messages.plans} />
        </PageHeader>
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="row-cards-pf">
              <CreatePlanCard />
              {cards}
            </div>
          </div>
        </div>
        {this.props.children}
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
