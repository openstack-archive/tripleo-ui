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

import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  FormattedTime,
  FormattedDate
} from 'react-intl';
import { MenuItem } from 'react-bootstrap';
import DropdownKebab from '../../ui/dropdown/DropdownKebab';
import {
  stackStates,
  deploymentStatusMessages
} from '../../../constants/StacksConstants';

const messages = defineMessages({
  deletingPlanName: {
    id: 'ListPlans.deletingPlanName',
    defaultMessage: 'Deleting {planName}...'
  },
  edit: {
    id: 'ListPlans.edit',
    defaultMessage: 'Edit'
  },
  export: {
    id: 'ListPlans.export',
    defaultMessage: 'Export'
  },
  delete: {
    id: 'ListPlans.delete',
    defaultMessage: 'Delete'
  },
  notDeployed: {
    id: 'ListPlans.notDeployed',
    defaultMessage: 'Not deployed'
  }
});

class PlanCard extends React.Component {
  onPlanClick(e) {
    e.preventDefault();
    this.props.choosePlan(e.target.textContent);
  }

  getActiveIcon() {
    if (this.props.plan.name === this.props.currentPlanName) {
      return <span className="pficon pficon-flag icon-with-padding" />;
    }
    return false;
  }

  renderPlanName() {
    if (this.props.plan.transition === 'deleting') {
      return (
        <FormattedMessage
          {...messages.deletingPlanName}
          values={{ planName: <strong>{this.props.plan.name}</strong> }}
        />
      );
    } else {
      return (
        <a href="" onClick={this.onPlanClick.bind(this)}>
          {this.props.plan.name}
        </a>
      );
    }
  }

  _getIcon(stack) {
    switch (stack.get('stack_status')) {
      case stackStates.CREATE_IN_PROGRESS:
      case stackStates.UPDATE_IN_PROGRESS:
      case stackStates.DELETE_IN_PROGRESS:
        return <span className="pficon pficon-spinner" />;

      case stackStates.CREATE_COMPLETE:
      case stackStates.UPDATE_COMPLETE:
        return <span className="pficon pficon-ok" />;

      case stackStates.CREATE_FAILED:
      case stackStates.UPDATE_FAILED:
        return <span className="pficon pficon-error-circle-o" />;
    }
  }

  _getStatus(stack) {
    const { formatMessage } = this.props.intl;
    return formatMessage(
      stack
        ? deploymentStatusMessages[stack.get('stack_status')]
        : messages.notDeployed
    );
  }

  _renderStackInfoIcon(stack) {
    const icon = stack
      ? this._getIcon(stack)
      : <span className="pficon pficon-info" />;
    const status = this._getStatus(stack);
    return (
      <span data-tooltip={status} className="tooltip-right">
        {icon}
      </span>
    );
  }

  renderStackInfo() {
    const { stack } = this.props;
    let modified = null;

    if (stack) {
      const time = stack.get('updated_time') || stack.get('creation_time');
      modified = (
        <span>
          Last modified:
          &nbsp;
          <FormattedDate value={time} />
          &nbsp;
          <FormattedTime value={time} />
        </span>
      );
    }

    return (
      <p>
        {modified}
        {this._renderStackInfoIcon(stack)}
      </p>
    );
  }

  handleOnSelect(eventKey) {
    switch (eventKey) {
      case 'edit': {
        browserHistory.push(`/plans/${this.props.plan.name}/edit?tab=editPlan`);
        break;
      }
      case 'export': {
        browserHistory.push(`/plans/${this.props.plan.name}/export`);
        break;
      }
      case 'delete': {
        browserHistory.push(`/plans/${this.props.plan.name}/delete`);
        break;
      }
    }
  }

  render() {
    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card-pf">
          <h2 className="card-pf-title">
            {this.renderPlanName()}
            {this.getActiveIcon()}
            <div className="pull-right">
              <DropdownKebab
                onSelect={this.handleOnSelect.bind(this)}
                id={`card-actions-${this.props.plan.name}`}
              >
                <MenuItem eventKey="edit">
                  <FormattedMessage {...messages.edit} />
                </MenuItem>
                <MenuItem eventKey="export">
                  <FormattedMessage {...messages.export} />
                </MenuItem>
                <MenuItem eventKey="delete">
                  <FormattedMessage {...messages.delete} />
                </MenuItem>
              </DropdownKebab>
            </div>
          </h2>
          <div className="card-pf-body">
            {/* TODO(hpokorny): fetchPlans() doesn't provide description yet */}
            {this.renderStackInfo()}
          </div>
        </div>
      </div>
    );
  }
}

PlanCard.propTypes = {
  choosePlan: PropTypes.func,
  currentPlanName: PropTypes.string,
  intl: PropTypes.object,
  plan: PropTypes.object,
  stack: PropTypes.object
};

export default injectIntl(PlanCard);
