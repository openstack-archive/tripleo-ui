import { combineReducers } from 'redux';
import apiStatusReducer from './apiStatusReducer';
import environmentConfigurationReducer from './environmentConfigurationReducer';
import loginReducer from './loginReducer';
import nodesReducer from './nodesReducer';
import notificationsReducer from './notificationsReducer';
import parametersReducer from './parametersReducer';
import plansReducer from './plansReducer';
import registerNodesReducer from './registerNodesReducer';
import rolesReducer from './rolesReducer';
import validationsReducer from './validationsReducer';

const appReducer = combineReducers({
  apiStatus: apiStatusReducer,
  environmentConfiguration: environmentConfigurationReducer,
  login: loginReducer,
  nodes: nodesReducer,
  notifications: notificationsReducer,
  parameters: parametersReducer,
  plans: plansReducer,
  registerNodes: registerNodesReducer,
  roles: rolesReducer,
  validations: validationsReducer
});

export default appReducer;
