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

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import appConfig from './appConfig';
import environmentConfigurationReducer from './environmentConfigurationReducer';
import filtersReducer from './filtersReducer';
import flavorsReducer from './flavorsReducer';
import i18nReducer from './i18nReducer';
import loggerReducer from './loggerReducer';
import loginReducer from './loginReducer';
import nodesReducer from './nodesReducer';
import notificationsReducer from './notificationsReducer';
import parametersReducer from './parametersReducer';
import plansReducer from './plansReducer';
import registerNodesReducer from './registerNodesReducer';
import rolesReducer from './rolesReducer';
import { availableRolesReducer } from './rolesReducer';
import stacksReducer from './stacksReducer';
import validationsReducer from './validationsReducer';
import workflowExecutionsReducer from './workflowExecutionsReducer';

const appReducer = combineReducers({
  appConfig,
  environmentConfiguration: environmentConfigurationReducer,
  executions: workflowExecutionsReducer,
  filters: filtersReducer,
  flavors: flavorsReducer,
  i18n: i18nReducer,
  logger: loggerReducer,
  login: loginReducer,
  nodes: nodesReducer,
  notifications: notificationsReducer,
  parameters: parametersReducer,
  plans: plansReducer,
  registerNodes: registerNodesReducer,
  roles: rolesReducer,
  availableRoles: availableRolesReducer,
  stacks: stacksReducer,
  validations: validationsReducer,
  form: formReducer
});

export default appReducer;
