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
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { InlineLoader, OverlayLoader } from '../../ui/Loader';
import PlanActions from './PlanActions';
import {
  deploymentStates,
  shortDeploymentStatusMessages
} from '../../../constants/DeploymentConstants';

const messages = defineMessages({
  deleting: {
    id: 'PlanCard.deletingPlan',
    defaultMessage: 'Deleting {planName}...'
  },
  updating: {
    id: 'PlanCard.updatingPlan',
    defaultMessage: 'Updating {planName}...'
  },
  loadingStatus: {
    id: 'PlanCard.loadingStatus',
    defaultMessage: 'Loading deployment status...'
  }
});

class PlanCard extends React.Component {
  componentDidMount() {
    this.props.getDeploymentStatus(this.props.plan.name);
  }

  renderStatusIcon() {
    const { status } = this.props;
    switch (status) {
      case deploymentStates.DEPLOYING:
      case deploymentStates.UNDEPLOYING:
        return <InlineLoader />;
      case deploymentStates.DEPLOY_SUCCESS:
        return <span className="pficon pficon-ok" />;
      case deploymentStates.DEPLOY_FAILED:
      case deploymentStates.UNDEPLOY_FAILED:
        return <span className="pficon pficon-error-circle-o" />;
      case deploymentStates.UNKNOWN:
        return <span className="pficon pficon-warning-triangle-o" />;
      default:
        return null;
    }
  }

  renderStatusInfo() {
    const { plan, status, statusLoaded, intl: { formatMessage } } = this.props;
    return (
      <ul className="list-unstyled">
        <li>
          <strong>Status:</strong> {this.renderStatusIcon(plan.name)}{' '}
          {status && (
            <InlineLoader
              loaded={statusLoaded}
              content={formatMessage(messages.loadingStatus)}
            >
              <FormattedMessage {...shortDeploymentStatusMessages[status]} />
            </InlineLoader>
          )}
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
      status
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
          <OverlayLoader
            className="card-loader"
            loaded={!plan.transition}
            content={
              plan.transition
                ? formatMessage(messages[plan.transition], {
                    planName: plan.name
                  })
                : ''
            }
          >
            <h2 className="card-pf-title">
              {plan.name}
              <PlanActions planName={plan.name} status={status} />
            </h2>
            {plan.description && (
              <div className="card-pf-body">{plan.description}</div>
            )}
            <div className="card-pf-footer">{this.renderStatusInfo()}</div>
          </OverlayLoader>
        </div>
      </div>
    );
  }
}

PlanCard.propTypes = {
  currentPlanName: PropTypes.string,
  getDeploymentStatus: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  plan: PropTypes.object.isRequired,
  status: PropTypes.string,
  statusLoaded: PropTypes.bool.isRequired
};

export default withRouter(injectIntl(PlanCard));
