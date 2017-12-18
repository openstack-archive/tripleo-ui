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

import { applyMiddleware, createStore } from 'redux';
import cookie from 'react-cookie';
import { fromJS } from 'immutable';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import logger, { predicate } from './services/logging/LoggingService';

import { AppConfig } from './immutableRecords/appConfig';
import appReducer from './reducers/appReducer';
import { InitialPlanState } from './immutableRecords/plans';
import { InitialLoginState } from './immutableRecords/login';
import { getIntl } from './selectors/i18n';

const hydrateStore = () => {
  return {
    appConfig: new AppConfig(window && fromJS(window.tripleOUiConfig)),
    plans: new InitialPlanState({
      currentPlanName: getStoredPlanName()
    }),
    login: new InitialLoginState({
      tokenId: cookie.load('keystoneAuthTokenId')
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
  predicate: predicate,
  logger: logger,
  // We're turning off all colors here because the formatting chars obscure the
  // content server-side.
  colors: false
});

const store = createStore(
  appReducer,
  hydrateStore(),
  applyMiddleware(
    thunkMiddleware.withExtraArgument({ getIntl }),
    loggerMiddleware
  )
);

logger.setReduxDispatch(store.dispatch);

export default store;
