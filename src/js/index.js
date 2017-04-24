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

import 'babel-polyfill';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect } from 'react-router';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';

import App from './components/App';
import AuthenticatedContent from './components/AuthenticatedContent';
import UserAuthenticator from './components/UserAuthenticator';
import DeletePlan from './components/plan/DeletePlan';
import DeploymentConfiguration
  from './components/deployment_plan/DeploymentConfiguration';
import DeploymentDetail from './components/deployment/DeploymentDetail';
import DeploymentPlan from './components/deployment_plan/DeploymentPlan';
import EditPlan from './components/plan/EditPlan';
import ExportPlan from './components/plan/ExportPlan';
import EnvironmentConfiguration
  from './components/environment_configuration/EnvironmentConfiguration.js';
import { getCurrentStackDeploymentInProgress } from './selectors/stacks';
import I18nProvider from './components/i18n/I18nProvider';
import initFormsy from './components/utils/Formsy';
import ListPlans from './components/plan/ListPlans';
import Login from './components/Login';
import LoginActions from './actions/LoginActions';
import NewPlan from './components/plan/NewPlan';
import Nodes from './components/nodes/Nodes';
import NotificationActions from './actions/NotificationActions';
import Parameters from './components/parameters/Parameters.js';
import Plans from './components/plan/Plans.js';
import RegisterNodesDialog from './components/nodes/RegisterNodesDialog';
import RoleDetail from './components/roles/RoleDetail';
import RoleNetworkConfig from './components/roles/RoleNetworkConfig';
import RoleParameters from './components/roles/RoleParameters';
import RoleServices from './components/roles/RoleServices';
import store from './store';
import '../less/base.less';
import ZaqarWebSocketService from './services/ZaqarWebSocketService';

ZaqarWebSocketService.setStore(store);

/**
  * @function checkAuth
  * If user is not logged in, check if there is an auth token in a cookie
  * If there is, try to login with this token, else redirect to Login
  */
function checkAuth(nextState, replace) {
  if (!store.getState().login.hasIn(['keystoneAccess', 'user'])) {
    const keystoneAuthTokenId = cookie.load('keystoneAuthTokenId');
    if (keystoneAuthTokenId) {
      const nextPath =
        nextState.location.pathname + nextState.location.search || '/';
      store.dispatch(
        LoginActions.authenticateUserViaToken(keystoneAuthTokenId, nextPath)
      );
    } else {
      replace({
        pathname: '/login',
        query: {
          nextPath: nextState.location.pathname + nextState.location.search
        }
      });
    }
  }
}

function checkRunningDeployment(nextState, replace) {
  const state = store.getState();
  let currentPlanName = state.currentPlan.currentPlanName;
  if (getCurrentStackDeploymentInProgress(state)) {
    store.dispatch(
      NotificationActions.notify({
        title: 'Not allowed',
        message: `A deployment for the plan ${currentPlanName} is already in progress.`,
        type: 'warning'
      })
    );
    // TODO(flfuchs): Redirect to deployment status modal instead of DeploymentPlan
    // page (in separate patch).
    replace('/deployment-plan/');
  }
}

let routes = (
  <Route>
    <Redirect from="/" to="/deployment-plan" />
    <Route path="/" component={App}>
      <Route component={UserAuthenticator} onEnter={checkAuth}>
        <Route component={AuthenticatedContent}>

          <Route path="deployment-plan" component={DeploymentPlan}>
            <Redirect from="configuration" to="configuration/environment" />
            <Route
              path="configuration"
              component={DeploymentConfiguration}
              onEnter={checkRunningDeployment}
            >
              <Route path="environment" component={EnvironmentConfiguration} />
              <Route path="parameters" component={Parameters} />
            </Route>
            <Redirect
              from="roles/:roleIdentifier"
              to="roles/:roleIdentifier/parameters"
            />
            <Route
              path="roles/:roleIdentifier"
              component={RoleDetail}
              onEnter={checkRunningDeployment}
            >
              <Route path="parameters" component={RoleParameters} />
              <Route path="services" component={RoleServices} />
              <Route
                path="network-configuration"
                component={RoleNetworkConfig}
              />
            </Route>
            <Route path="deployment-detail" component={DeploymentDetail} />
          </Route>

          <Route path="nodes" component={Nodes}>
            <Route path="register" component={RegisterNodesDialog} />
          </Route>

          <Redirect from="plans" to="plans/list" />
          <Route path="plans" component={Plans}>
            <Route path="list" component={ListPlans}>
              <Route path="/plans/new" component={NewPlan} />
              <Route path="/plans/:planName/delete" component={DeletePlan} />
              <Route path="/plans/:planName/edit" component={EditPlan} />
              <Route path="/plans/:planName/export" component={ExportPlan} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="login" component={Login} />
    </Route>
  </Route>
);

initFormsy();

ReactDOM.render(
  <Provider store={store}>
    <I18nProvider>
      <Router history={browserHistory}>{routes}</Router>
    </I18nProvider>
  </Provider>,
  document.getElementById('react-app-index')
);
