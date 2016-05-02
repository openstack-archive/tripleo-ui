import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import { Link } from 'react-router';

import DropdownItem from '../ui/dropdown/DropdownItem';
import DropdownButton from '../ui/dropdown/DropdownButton';
import Dropdown from '../ui/dropdown/Dropdown';

export default class PlansDropdown extends React.Component {
  renderRecentPlans() {
    return this.props.plans.toList().map(plan => {
      return (
        <DropdownItem key={plan.name}
                      onClick={this.props.choosePlan.bind(this, plan.name)}>
          {plan.name}
        </DropdownItem>
      );
    });
  }

  render() {
    if(this.props.plans.isEmpty()) {
      return (
        <Link className="btn btn-link" to="/plans/list">Manage Deployments</Link>
      );
    } else {
      return (
        <Dropdown>
          <DropdownButton className="btn-link">Select Deployment</DropdownButton>
          {this.renderRecentPlans()}
          <DropdownItem key="divider" divider/>
          <DropdownItem key="plansLink" to="/plans/list">Manage Deployments</DropdownItem>
        </Dropdown>
      );
    }
  }
}
PlansDropdown.propTypes = {
  choosePlan: React.PropTypes.func,
  plans: ImmutablePropTypes.map
};
