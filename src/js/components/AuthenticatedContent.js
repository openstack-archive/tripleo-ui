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
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import MainContent from './MainContent';
import DebugScreen from './debug/DebugScreen';
import DeploymentPlan from './deployment_plan/DeploymentPlan';
import { getCurrentPlanName } from '../selectors/plans';
import { GlobalLoader } from './ui/Loader';
import NavBar from './NavBar';
import Nodes from './nodes/Nodes';
import Plans from './plan/Plans.js';
import PlansActions from '../actions/PlansActions';
import WorkflowExecutionsActions from '../actions/WorkflowExecutionsActions';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';

const messages = defineMessages({
  loadingDeployments: {
    id: 'AuthenticatedContent.loadingDeployments',
    defaultMessage: 'Loading Deployments...'
  }
});

class AuthenticatedContent extends React.Component {
  componentDidMount() {
    this.props.initializeZaqarConnection();
    this.props.fetchPlans();
    this.props.fetchWorkflowExecutions();
  }

  render() {
    const { currentPlanName, intl, plansLoaded, showValidations } = this.props;
    return (
      <GlobalLoader
        loaded={plansLoaded}
        content={intl.formatMessage(messages.loadingDeployments)}
      >
        <NavBar />
        <MainContent showValidations={showValidations}>
          <Switch>
            <Route path="/debug" component={DebugScreen} />
            <Route path="/nodes" component={Nodes} />
            <Route path="/plans/manage" component={Plans} />
            <Route path="/plans/:planName" component={DeploymentPlan} />
            {currentPlanName ? (
              <Redirect from="/" to={`/plans/${currentPlanName}`} />
            ) : (
              <Redirect from="/" to="/plans/manage" />
            )}
          </Switch>
        </MainContent>
      </GlobalLoader>
    );
  }
}
AuthenticatedContent.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string,
  dispatch: PropTypes.func,
  fetchPlans: PropTypes.func,
  fetchWorkflowExecutions: PropTypes.func,
  initializeZaqarConnection: PropTypes.func.isRequired,
  intl: PropTypes.object,
  plansLoaded: PropTypes.bool,
  showValidations: PropTypes.bool.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchPlans: () => dispatch(PlansActions.fetchPlans()),
  fetchWorkflowExecutions: () =>
    dispatch(WorkflowExecutionsActions.fetchWorkflowExecutions()),
  initializeZaqarConnection: () => dispatch(ZaqarWebSocketService.init())
});

const mapStateToProps = state => ({
  currentPlanName: getCurrentPlanName(state),
  plansLoaded: state.plans.get('plansLoaded'),
  showValidations: state.validations.showValidations
});

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthenticatedContent))
);
