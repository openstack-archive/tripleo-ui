import 'babel-polyfill';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Router, Route, Redirect } from 'react-router';
import history from './history';

import App from './components/App';
import AuthenticatedContent from './components/AuthenticatedContent';
import DeletePlan from './components/plan/DeletePlan';
import IntrospectedNodesTabPane from './components/nodes/IntrospectedNodesTabPane';
import DeploymentConfiguration from './components/deployment-plan/DeploymentConfiguration';
import DeploymentPlan from './components/deployment-plan/DeploymentPlan';
import EditPlan from './components/plan/EditPlan';
import EnvironmentConfiguration from
  './components/environment_configuration/EnvironmentConfiguration.js';
import ListPlans from './components/plan/ListPlans';
import Login from './components/Login';
import LoginActions from './actions/LoginActions';
import MaintenanceNodesTabPane from './components/nodes/MaintenanceNodesTabPane';
import NewPlan from './components/plan/NewPlan';
import Nodes from './components/nodes/Nodes';
import NodesAssignment from './components/deployment-plan/NodesAssignment';
import Parameters from './components/parameters/Parameters.js';
import Plans from './components/plan/Plans.js';
import ProvisionedNodesTabPane from './components/nodes/ProvisionedNodesTabPane';
import RegisterNodesDialog from './components/nodes/RegisterNodesDialog';
import RegisteredNodesTabPane from './components/nodes/RegisteredNodesTabPane';
import TempStorage from './services/TempStorage.js';
import store from './store';

TempStorage.initialized.then(() => {
  /**
   * @function checkAuth
   * If user is not logged in, check if there is an auth token in TempStorage
   * If there is, try to login with this token, else redirect to Login
   */
  function checkAuth(nextState, replaceState) {
    if (!store.getState().login.hasIn(['keystoneAccess','user'])) {
      const keystoneAuthTokenId = TempStorage.getItem('keystoneAuthTokenId');
      if (keystoneAuthTokenId) {
        const nextPath = nextState.location.pathname +
                         nextState.location.search || '/';
        store.dispatch(LoginActions.authenticateUserViaToken(keystoneAuthTokenId, nextPath));
      } else {
        replaceState(null, '/login', { nextPath: nextState.location.pathname +
                                                 nextState.location.search });
      }
    }
  }

  let routes = (
    <Route>
      <Redirect from="/" to="/deployment-plan"/>
      <Route path="/" component={App}>
        <Route component={AuthenticatedContent} onEnter={checkAuth}>

          <Route path="deployment-plan" component={DeploymentPlan}>
            <Redirect from="configuration" to="configuration/environment"/>
            <Route path="configuration" component={DeploymentConfiguration}>
              <Route path="environment" component={EnvironmentConfiguration}/>
              <Route path="parameters" component={Parameters}/>
            </Route>
            <Route path=":roleName/assignNodes" component={NodesAssignment}/>
          </Route>

          <Redirect from="nodes" to="nodes/registered"/>
          <Route path="nodes" component={Nodes}>
            <Route path="registered" component={RegisteredNodesTabPane}>
              <Route path="register" component={RegisterNodesDialog}/>
            </Route>
            <Route path="introspected" component={IntrospectedNodesTabPane}/>
            <Route path="provisioned" component={ProvisionedNodesTabPane}/>
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
        <Route path="login" component={Login}/>
      </Route>
    </Route>
  );

  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <Router history={history}>{routes}</Router>
      </IntlProvider>
    </Provider>,
    document.getElementById('react-app-index')
  );

});
