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
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import DebugScreen from './debug/DebugScreen';
import DeploymentPlan from './deployment_plan/DeploymentPlan';
import { getCurrentPlanName } from '../selectors/plans';
import { getEnabledLanguages } from '../selectors/i18n';
import Loader from './ui/Loader';
import LoginActions from '../actions/LoginActions';
import NavBar from './NavBar';
import Nodes from './nodes/Nodes';
import Plans from './plan/Plans.js';
import PlansActions from '../actions/PlansActions';
import ValidationsList from './validations/ValidationsList';
import WorkflowExecutionsActions from '../actions/WorkflowExecutionsActions';
import ZaqarActions from '../actions/ZaqarActions';

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
    const {
      currentPlanName,
      intl,
      languages,
      logoutUser,
      plansLoaded,
      user
    } = this.props;
    return (
      <Loader
        loaded={plansLoaded}
        content={intl.formatMessage(messages.loadingDeployments)}
        global
      >
        <header>
          <NavBar
            user={user}
            onLogout={logoutUser.bind(this)}
            languages={languages}
          />
        </header>
        <div className="wrapper-fixed-body container-fluid">
          <div className="row">
            <div className="col-sm-12 col-lg-9">
              <Switch>
                <Route path="/debug" component={DebugScreen} />
                <Route path="/nodes" component={Nodes} />
                <Route path="/plans/manage" component={Plans} />
                <Route path="/plans/:planName" component={DeploymentPlan} />
                {currentPlanName
                  ? <Redirect from="/" to={`/plans/${currentPlanName}`} />
                  : <Redirect from="/" to="/plans/manage" />}
              </Switch>
            </div>
            <ValidationsList />
          </div>
        </div>
      </Loader>
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
  languages: ImmutablePropTypes.map.isRequired,
  logoutUser: PropTypes.func.isRequired,
  plansLoaded: PropTypes.bool,
  user: ImmutablePropTypes.map
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  logoutUser: () => dispatch(LoginActions.logoutUser()),
  fetchPlans: () => dispatch(PlansActions.fetchPlans()),
  fetchWorkflowExecutions: () =>
    dispatch(WorkflowExecutionsActions.fetchWorkflowExecutions()),
  initializeZaqarConnection: () =>
    dispatch(ZaqarActions.initializeConnection(ownProps.history))
});

const mapStateToProps = state => ({
  languages: getEnabledLanguages(state),
  currentPlanName: getCurrentPlanName(state),
  plansLoaded: state.plans.get('plansLoaded'),
  user: state.login.getIn(['token', 'user'])
});

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthenticatedContent))
);
