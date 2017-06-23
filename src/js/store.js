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

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import logger from './services/logger';

import appReducer from './reducers/appReducer';
import { CurrentPlanState } from './immutableRecords/currentPlan';
import { getIntl } from './selectors/i18n';

const hydrateStore = () => {
  return {
    currentPlan: new CurrentPlanState({
      currentPlanName: getStoredPlanName()
    })
  };
};

function getStoredPlanName() {
  if (window && window.localStorage) {
    return window.localStorage.getItem('currentPlanName');
  }
}

const loggerMiddleware = createLogger({
  collapsed: true,
  logger: logger
});

const store = createStore(
  appReducer,
  hydrateStore(),
  applyMiddleware(
    thunkMiddleware.withExtraArgument({ getIntl }),
    loggerMiddleware
  )
);

export default store;
