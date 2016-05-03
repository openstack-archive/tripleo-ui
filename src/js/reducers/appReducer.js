import { combineReducers } from 'redux';
import currentPlanReducer from './currentPlanReducer';
import environmentConfigurationReducer from './environmentConfigurationReducer';
import loginReducer from './loginReducer';
import nodesReducer from './nodesReducer';
import notificationsReducer from './notificationsReducer';
import parametersReducer from './parametersReducer';
import plansReducer from './plansReducer';
import registerNodesReducer from './registerNodesReducer';
import rolesReducer from './rolesReducer';
import stacksReducer from './stacksReducer';
import validationsReducer from './validationsReducer';

const appReducer = combineReducers({
  currentPlan: currentPlanReducer,
  environmentConfiguration: environmentConfigurationReducer,
  login: loginReducer,
  nodes: nodesReducer,
  notifications: notificationsReducer,
  parameters: parametersReducer,
  plans: plansReducer,
  registerNodes: registerNodesReducer,
  roles: rolesReducer,
  stacks: stacksReducer,
  validations: validationsReducer
});

export default appReducer;
