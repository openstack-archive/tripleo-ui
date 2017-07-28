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
import { withRouter } from 'react-router-dom';
import {
  defineMessages,
  injectIntl,
  FormattedDate,
  FormattedTime
} from 'react-intl';

import Loader from '../../ui/Loader';
import PlanActions from './PlanActions';
import {
  stackStates,
  deploymentStatusMessages
} from '../../../constants/StacksConstants';

const messages = defineMessages({
  deleting: {
    id: 'PlanCard.deletingPlan',
    defaultMessage: 'Deleting {planName}...'
  },
  updating: {
    id: 'PlanCard.updatingPlan',
    defaultMessage: 'Updating {planName}...'
  },
  notDeployed: {
    id: 'PlanCard.notDeployed',
    defaultMessage: 'Not deployed'
  }
});

class PlanCard extends React.Component {
  renderStackIcon() {
    const { stack } = this.props;
    if (stack) {
      switch (stack.get('stack_status')) {
        case stackStates.CREATE_IN_PROGRESS:
        case stackStates.UPDATE_IN_PROGRESS:
        case stackStates.DELETE_IN_PROGRESS:
          return <Loader inline />;

        case stackStates.CREATE_COMPLETE:
        case stackStates.UPDATE_COMPLETE:
          return <span className="pficon pficon-ok" />;

        case stackStates.CREATE_FAILED:
        case stackStates.UPDATE_FAILED:
          return <span className="pficon pficon-error-circle-o" />;
      }
    }
  }

  getDeploymentStatus(stack) {
    return this.props.intl.formatMessage(
      stack
        ? deploymentStatusMessages[stack.get('stack_status')]
        : messages.notDeployed
    );
  }

  renderStackInfo() {
    const { stack } = this.props;
    let modified = null;

    if (stack) {
      const time = stack.get('updated_time') || stack.get('creation_time');
      modified = (
        <span>
          <strong>Last modified:</strong>
          &nbsp;
          <FormattedDate value={time} />
          &nbsp;
          <FormattedTime value={time} />
        </span>
      );
    }

    return (
      <ul className="list-unstyled">
        <li>
          <strong>Status:</strong>
          {' '}
          {this.renderStackIcon(stack)}
          {' '}
          {this.getDeploymentStatus(stack)}
        </li>
        <li>
          {modified}
        </li>
      </ul>
    );
  }

  render() {
    const {
      currentPlanName,
      intl: { formatMessage },
      history,
      plan,
      stack
    } = this.props;
    const cardClasses = ClassNames({
      'plan-card card-pf card-pf-view card-pf-view-select card-pf-view-single-select': true,
      active: plan.name === currentPlanName
    });

    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div
          className={cardClasses}
          onClick={() => history.push(`/plans/${plan.name}`)}
        >
          <Loader
            loaded={!plan.transition}
            content={
              plan.transition
                ? formatMessage(messages[plan.transition], {
                    planName: plan.name
                  })
                : ''
            }
            height={62}
            overlay
          />
          <h2 className="card-pf-title">
            {plan.name}
            <PlanActions planName={plan.name} stack={stack} />
          </h2>
          {plan.description &&
            <div className="card-pf-body">
              {plan.description}
            </div>}
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
  history: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  plan: PropTypes.object.isRequired,
  stack: PropTypes.object
};

export default withRouter(injectIntl(PlanCard));
