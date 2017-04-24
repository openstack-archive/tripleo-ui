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

// Logger is a `console` replacement which is capable of sending its output to
// multiple places, like the browser console, REST APIs, or a Zaqar queue.
//
// Adding new log destinations consists of creating an adapter.  An adapter in
// this context is a subclass of Adapter.
//
// The Logger class reads the tripleOUiConfig object to determine which logger
// adapters should be activated.  By default, only the console adapter is used.
//
// Usage:
//
//   import logger from 'src/js/services/logging/LoggingService';
//   logger.log('Hello world!');

import * as _ from 'lodash';
import LoggerConstants from '../../constants/LoggerConstants';
import ConsoleAdapter from './adapters/ConsoleAdapter';
import ZaqarAdapter from './adapters/ZaqarAdapter';

const AVAILABLE_ADAPTERS = {
  console: new ConsoleAdapter(),
  zaqar: new ZaqarAdapter()
};

class Logger {
  AVAILABLE_FUNCTIONS = [
    'debug',
    'info',
    'warn',
    'error',
    'group',
    'groupCollapsed',
    'groupEnd',
    'log'
  ];

  constructor() {
    this.adapters = [];

    if (window.tripleOUiConfig !== undefined) {
      this.loadAdapters();
    }

    this.AVAILABLE_FUNCTIONS.forEach(fn => {
      this[fn] = function(...args) {
        return this.dispatch(fn, ...args);
      };
    });

    this.registerGlobalErrorHandler();
  }

  loadAdapters() {
    if (this.adapters.length) {
      return;
    }

    let enabledAdapters = (window.tripleOUiConfig || {}).loggers || ['console'];

    enabledAdapters.forEach(adapter => {
      let instance = AVAILABLE_ADAPTERS[adapter];

      if (instance === undefined) {
        throw Error(`Adapter ${adapter} not defined`);
      }

      this.adapters.push(instance);
    });
  }

  dispatch(fn, ...args) {
    this.loadAdapters();

    this.adapters.forEach(adapter => {
      let f = adapter[fn];

      if (f === undefined) {
        throw Error(`Function ${fn} not defined in ${adapter}`);
      }

      return adapter[fn](...args);
    });
  }

  registerGlobalErrorHandler() {
    window.onerror = (messageOrEvent, source, lineno, colno, e) => {
      this.error(e);
      return true;
    };
  }
}

const isLoggerAction = action => _.includes(LoggerConstants, action.type);

// The `predicate` prevents redux-logger from logging logger messages
// in order to avoid an infinite loop.  This function is used in `createLogger`
// in store.js.
export const predicate = (getState, action) => !isLoggerAction(action);

export default new Logger();
