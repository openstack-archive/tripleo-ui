import 'babel-polyfill';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Router, Route, Redirect } from 'react-router';
import { browserHistory } from 'react-router';

import App from './components/App';
import AuthenticatedContent from './components/AuthenticatedContent';
import UserAuthenticator from './components/UserAuthenticator';
import DeletePlan from './components/plan/DeletePlan';
import DeploymentConfiguration from './components/deployment_plan/DeploymentConfiguration';
import DeploymentDetail from './components/deployment/DeploymentDetail';
import DeploymentPlan from './components/deployment_plan/DeploymentPlan';
import EditPlan from './components/plan/EditPlan';
import EnvironmentConfiguration from
  './components/environment_configuration/EnvironmentConfiguration.js';
import { getCurrentStackDeploymentProgress } from './selectors/stacks';
import ListPlans from './components/plan/ListPlans';
import Login from './components/Login';
import LoginActions from './actions/LoginActions';
import MaintenanceNodesTabPane from './components/nodes/MaintenanceNodesTabPane';
import NewPlan from './components/plan/NewPlan';
import Nodes from './components/nodes/Nodes';
import NodesAssignment from './components/deployment_plan/NodesAssignment';
import NotificationActions from './actions/NotificationActions';
import Parameters from './components/parameters/Parameters.js';
import Plans from './components/plan/Plans.js';
import DeployedNodesTabPane from './components/nodes/DeployedNodesTabPane';
import RegisterNodesDialog from './components/nodes/RegisterNodesDialog';
import RegisteredNodesTabPane from './components/nodes/RegisteredNodesTabPane';
import RoleDetail from './components/roles/RoleDetail';
import RoleParameters from './components/roles/RoleParameters';
import RoleServices from './components/roles/RoleServices';
import TempStorage from './services/TempStorage.js';
import store from './store';

import '../less/base.less';

TempStorage.initialized.then(() => {
  /**
   * @function checkAuth
   * If user is not logged in, check if there is an auth token in TempStorage
   * If there is, try to login with this token, else redirect to Login
   */
  function checkAuth(nextState, replace) {
    if (!store.getState().login.hasIn(['keystoneAccess','user'])) {
      const keystoneAuthTokenId = TempStorage.getItem('keystoneAuthTokenId');
      if (keystoneAuthTokenId) {
        const nextPath = nextState.location.pathname +
                         nextState.location.search || '/';
        store.dispatch(LoginActions.authenticateUserViaToken(keystoneAuthTokenId, nextPath));
      } else {
        replace({ pathname: '/login',
                  query: { nextPath: nextState.location.pathname + nextState.location.search } });
      }
    }
  }

  function checkRunningDeployment(nextState, replace) {
    const state = store.getState();
    let currentPlanName = state.currentPlan.currentPlanName;
    if(getCurrentStackDeploymentProgress(state)) {
      store.dispatch(NotificationActions.notify({
        title: 'Not allowed',
        message: `A deployment for the plan ${currentPlanName} is already in progress.`,
        type: 'warning'
      }));
      // TODO(flfuchs): Redirect to deployment status modal instead of DeploymentPlan
      // page (in separate patch).
      replace('/deployment-plan/');
    }
  }

  let routes = (
    <Route>
      <Redirect from="/" to="/deployment-plan"/>
      <Route path="/" component={App}>
        <Route component={UserAuthenticator} onEnter={checkAuth}>
          <Route component={AuthenticatedContent}>

            <Route path="deployment-plan" component={DeploymentPlan}>
              <Redirect from="configuration" to="configuration/environment"/>
              <Route path="configuration"
                     component={DeploymentConfiguration}
                     onEnter={checkRunningDeployment}>
                <Route path="environment" component={EnvironmentConfiguration}/>
                <Route path="parameters" component={Parameters}/>
              </Route>
              <Route path=":roleIdentifier/assign-nodes"
                     component={NodesAssignment}
                     onEnter={checkRunningDeployment}/>
              <Redirect from="roles/:roleIdentifier" to="roles/:roleIdentifier/parameters"/>
              <Route path="roles/:roleIdentifier"
                     component={RoleDetail}
                     onEnter={checkRunningDeployment}>
                <Route path="parameters" component={RoleParameters}/>
                <Route path="services" component={RoleServices}/>
              </Route>
              <Route path="deployment-detail"
                     component={DeploymentDetail}/>
            </Route>

            <Redirect from="nodes" to="nodes/registered"/>
            <Route path="nodes" component={Nodes}>
              <Route path="registered" component={RegisteredNodesTabPane}>
                <Route path="register" component={RegisterNodesDialog}/>
              </Route>
            <Route path="deployed" component={DeployedNodesTabPane}/>
              <Route path="maintenance" component={MaintenanceNodesTabPane}/>
            </Route>

            <Redirect from="plans" to="plans/list"/>
            <Route path="plans" component={Plans}>
              <Route path="list" component={ListPlans}>
                <Route path="/plans/new" component={NewPlan}/>
                <Route path="/plans/:planName/delete" component={DeletePlan}/>
                <Route path="/plans/:planName/edit" component={EditPlan}/>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="login" component={Login}/>
      </Route>
    </Route>
  );

  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <Router history={browserHistory}>{routes}</Router>
      </IntlProvider>
    </Provider>,
    document.getElementById('react-app-index')
  );

});
