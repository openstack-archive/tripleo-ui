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
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { InlineLoader, OverlayLoader } from '../../ui/Loader';
import PlanActions from './PlanActions';
import {
  deploymentStates,
  shortDeploymentStatusMessages
} from '../../../constants/DeploymentConstants';
import { planTransitionMessages } from '../../../constants/PlansConstants';

const messages = defineMessages({
  loadingStatus: {
    id: 'PlanCard.loadingStatus',
    defaultMessage: 'Loading deployment status...'
  }
});

class PlanCard extends React.Component {
  componentDidMount() {
    const { planName } = this.props;
    this.props.fetchPlanDetails(planName);
    this.props.getDeploymentStatus(planName);
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
    const {
      planName,
      status,
      statusLoaded,
      intl: { formatMessage }
    } = this.props;
    return (
      <ul className="list-unstyled">
        <li>
          <strong>Status:</strong> {this.renderStatusIcon(planName)}{' '}
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
      planName,
      planDetails,
      transitions,
      status
    } = this.props;
    const cardClasses = ClassNames({
      'plan-card card-pf card-pf-view-select card-pf-view-single-select': true,
      'card-pf-view': planDetails,
      active: planName === currentPlanName
    });

    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div
          className={cardClasses}
          onClick={
            planDetails ? () => history.push(`/plans/${planName}`) : null
          }
        >
          <OverlayLoader
            className="card-loader"
            loaded={!transitions.size}
            content={
              transitions.size
                ? formatMessage(planTransitionMessages[transitions.first()], {
                    planName
                  })
                : ''
            }
          >
            <h2 className="card-pf-title">
              {planName}
              <PlanActions planName={planName} status={status} />
            </h2>
            {planDetails && (
              <div className="card-pf-body">{planDetails.description}</div>
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
  fetchPlanDetails: PropTypes.func.isRequired,
  getDeploymentStatus: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  planDetails: ImmutablePropTypes.record,
  planName: PropTypes.string.isRequired,
  status: PropTypes.string,
  statusLoaded: PropTypes.bool.isRequired,
  transitions: ImmutablePropTypes.list.isRequired
};

export default withRouter(injectIntl(PlanCard));
