import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import DropdownItem from '../ui/dropdown/DropdownItem';
import DropdownButton from '../ui/dropdown/DropdownButton';
import Dropdown from '../ui/dropdown/Dropdown';

const messages = defineMessages({
  manageDeployments: {
    id: 'PlansDropdown.manageDeployments',
    defaultMessage: 'Manage Deployments'
  },
  selectDeployment: {
    id: 'PlansDropdown.selectDeployment',
    defaultMessage: 'Select Deployment'
  }
});

class PlansDropdown extends React.Component {
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
    const { formatMessage } = this.props.intl;

    if(this.props.plans.isEmpty()) {
      return (
        <Link className="btn btn-link" to="/plans/list">
          {formatMessage(messages.manageDeployments)}
        </Link>
      );
    } else {
      return (
        <Dropdown>
          <DropdownButton className="btn-link">
            {formatMessage(messages.selectDeployment)}
          </DropdownButton>
          {this.renderRecentPlans()}
          <DropdownItem key="divider" divider/>
          <DropdownItem key="plansLink" to="/plans/list">
            {formatMessage(messages.manageDeployments)}
          </DropdownItem>
        </Dropdown>
      );
    }
  }
}
PlansDropdown.propTypes = {
  choosePlan: React.PropTypes.func,
  intl: React.PropTypes.object,
  plans: ImmutablePropTypes.map
};

export default injectIntl(PlansDropdown);
