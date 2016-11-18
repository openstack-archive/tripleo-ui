import { FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

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
        <Link className="btn btn-link" to="/plans/list">
          <FormattedMessage id="manage-deployments"
                            defaultMessage="Manage Deployments"
                            description="Manage Deployments"/>
        </Link>
      );
    } else {
      return (
        <Dropdown>
          <DropdownButton className="btn-link">
            <FormattedMessage id="select-deployment"
                              defaultMessage="Select Deployment"
                              description="Select Deployment" />
          </DropdownButton>
          {this.renderRecentPlans()}
          <DropdownItem key="divider" divider/>
          <DropdownItem key="plansLink" to="/plans/list">
            <FormattedMessage id="manage-deployments"
                              defaultMessage="Manage Deployments"
                              description="Manage Deployments"/>
          </DropdownItem>
        </Dropdown>
      );
    }
  }
}
PlansDropdown.propTypes = {
  choosePlan: React.PropTypes.func,
  plans: ImmutablePropTypes.map
};
