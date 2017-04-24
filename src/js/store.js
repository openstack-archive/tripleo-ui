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
import logger, { predicate } from './services/logging/LoggingService';
import ZaqarWebSocketService from './services/ZaqarWebSocketService';

import appReducer from './reducers/appReducer';
import { getIntl } from './selectors/i18n';

const loggerMiddleware = createLogger({
  collapsed: true,
  predicate: predicate,
  logger: logger,
  // We're turning off all colors here because the formatting chars obscure the
  // content server-side.
  colors: {
    title: false,
    prevState: false,
    action: false,
    nextState: false,
    error: false
  }
});

const store = createStore(
  appReducer,
  {},
  applyMiddleware(
    thunkMiddleware.withExtraArgument({ getIntl }),
    loggerMiddleware
  )
);

// As soon as the store is available, we can pass it to the Zaqar service which
// will use it to buffer incoming messages.  The sooner it knows about the
// store, the sooner it can start keeping track of messages.  It cannot be done
// any sooner than here.
ZaqarWebSocketService.setStore(store);

export default store;
