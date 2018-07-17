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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { getCurrentPlanName, getPlans } from '../../selectors/plans';
import {
  getDeploymentStatusByPlan,
  getDeploymentStatusUIByPlan
} from '../../selectors/deployment';
import { PageHeader } from '../ui/PageHeader';
import PlansActions from '../../actions/PlansActions';
import { getDeploymentStatus } from '../../actions/DeploymentActions';
import NoPlans from './NoPlans';
import PlanCard from './cards/PlanCard';
import ImportPlanCard from './cards/ImportPlanCard';

const messages = defineMessages({
  importPlan: {
    id: 'PlansList.importPlan',
    defaultMessage: 'Import Plan'
  },
  plans: {
    id: 'PlansList.plans',
    defaultMessage: 'Plans'
  }
});

class PlansList extends React.Component {
  componentWillMount() {
    this.props.fetchPlans();
  }

  render() {
    const {
      plans,
      currentPlanName,
      deploymentStates,
      deploymentStatesUI,
      getDeploymentStatus
    } = this.props;
    return (
      <div>
        <PageHeader>
          <FormattedMessage {...messages.plans} />
          <div className="pull-right">
            <Link
              to="/plans/manage/new"
              className="btn btn-primary"
              id="ListPlans__importPlanButton"
            >
              <FormattedMessage {...messages.importPlan} />
            </Link>
          </div>
        </PageHeader>
        {plans.isEmpty() ? (
          <NoPlans />
        ) : (
          <div className="panel panel-default">
            <div className="cards-pf">
              <div className="row row-cards-pf">
                <ImportPlanCard />
                {plans
                  .toList()
                  .map(plan => (
                    <PlanCard
                      key={plan.name}
                      plan={plan}
                      currentPlanName={currentPlanName}
                      status={deploymentStates.getIn([plan.name, 'status'])}
                      statusLoaded={deploymentStatesUI.getIn(
                        [plan.name, 'isLoaded'],
                        false
                      )}
                      getDeploymentStatus={getDeploymentStatus}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

PlansList.propTypes = {
  currentPlanName: PropTypes.string,
  deploymentStates: ImmutablePropTypes.map.isRequired,
  deploymentStatesUI: ImmutablePropTypes.map.isRequired,
  fetchPlans: PropTypes.func.isRequired,
  getDeploymentStatus: PropTypes.func.isRequired,
  plans: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state) {
  return {
    currentPlanName: getCurrentPlanName(state),
    plans: getPlans(state),
    deploymentStates: getDeploymentStatusByPlan(state),
    deploymentStatesUI: getDeploymentStatusUIByPlan(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlans: () => dispatch(PlansActions.fetchPlans()),
    getDeploymentStatus: planName => dispatch(getDeploymentStatus(planName))
  };
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(PlansList)
);
