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

import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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

export default class PlansDropdown extends React.Component {
  renderRecentPlans() {
    return this.props.plans.toList().map(plan => {
      return (
        <DropdownItem
          key={plan.name}
          onClick={this.props.choosePlan.bind(this, plan.name)}
        >
          {plan.name}
        </DropdownItem>
      );
    });
  }

  render() {
    if (this.props.plans.isEmpty()) {
      return (
        <Link className="btn btn-link" to="/plans">
          <FormattedMessage {...messages.manageDeployments} />
        </Link>
      );
    } else {
      return (
        <Dropdown>
          <DropdownButton className="btn-link">
            <FormattedMessage {...messages.selectDeployment} />
          </DropdownButton>
          {this.renderRecentPlans()}
          <DropdownItem key="divider" divider />
          <DropdownItem key="plansLink" to="/plans">
            <FormattedMessage {...messages.manageDeployments} />
          </DropdownItem>
        </Dropdown>
      );
    }
  }
}
PlansDropdown.propTypes = {
  choosePlan: PropTypes.func,
  plans: ImmutablePropTypes.map
};
