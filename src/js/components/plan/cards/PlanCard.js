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

import ClassNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  FormattedTime,
  FormattedDate
} from 'react-intl';
import Loader from '../../ui/Loader';
import MenuItemLink from '../../ui/dropdown/MenuItemLink';
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
        <Link to={`/plans/${this.props.plan.name}`}>
          {this.props.plan.name}
        </Link>
      );
    }
  }

  _getIcon(stack) {
    switch (stack.get('stack_status')) {
      case stackStates.CREATE_IN_PROGRESS:
      case stackStates.UPDATE_IN_PROGRESS:
      case stackStates.DELETE_IN_PROGRESS:
        return <Loader inline />;

      case stackStates.CREATE_COMPLETE:
      case stackStates.UPDATE_COMPLETE:
        return <span className="fa fa-cloud text-success" />;

      case stackStates.CREATE_FAILED:
      case stackStates.UPDATE_FAILED:
        return <span className="fa fa-cloud text-danger" />;
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
      : <span className="fa fa-cloud" />;
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
        <br />
        <strong>Status:</strong> {this._getStatus(stack)}
      </p>
    );
  }

  renderStackIcon(stack) {
    const icon = stack
      ? this._getIcon(stack)
      : <span className="fa fa-cloud" />;
    const status = this._getStatus(stack);
    return (
      <span title={status}>
        {icon}
      </span>
    );
  }

  render() {
    const { currentPlanName, plan: { name: planName }, stack } = this.props;
    const cardClasses = ClassNames({
      'plan-card card-pf card-pf-view card-pf-view-select card-pf-view-single-select': true,
      active: planName === currentPlanName
    });
    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div className={cardClasses}>
          <h2 className="card-pf-title">
            {this.renderStackIcon(stack)}{' '}
            {this.renderPlanName()}
            <div className="pull-right">
              <DropdownKebab id={`card-actions-${planName}`} pullRight>
                <MenuItemLink to={`/plans/manage/${planName}/edit`}>
                  <FormattedMessage {...messages.edit} />
                </MenuItemLink>
                <MenuItemLink to={`/plans/manage/${planName}/export`}>
                  <FormattedMessage {...messages.export} />
                </MenuItemLink>
                <MenuItemLink to={`/plans/manage/${planName}/delete`}>
                  <FormattedMessage {...messages.delete} />
                </MenuItemLink>
              </DropdownKebab>
            </div>
          </h2>
          {/* <div className="card-pf-body"> */}
          {/* TODO(hpokorny): fetchPlans() doesn't provide description yet */}
          {/* </div> */}
          <div className="card-pf-footer">
            {this.renderStackInfo()}
          </div>
        </div>
      </div>
    );
  }
}

PlanCard.propTypes = {
  currentPlanName: PropTypes.string,
  intl: PropTypes.object.isRequired,
  plan: PropTypes.object.isRequired,
  stack: PropTypes.object
};

export default injectIntl(PlanCard);
