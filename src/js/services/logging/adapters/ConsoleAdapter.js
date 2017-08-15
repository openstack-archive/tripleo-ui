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

import Adapter from './BaseAdapter';

export default class ConsoleAdapter extends Adapter {
  debug(...args) {
    console.debug(...args); // eslint-disable-line no-console
  }

  info(...args) {
    console.info(...args); // eslint-disable-line no-console
  }

  warn(...args) {
    console.warn(...args); // eslint-disable-line no-console
  }

  error(...args) {
    console.error(...args); // eslint-disable-line no-console
  }

  group(...args) {
    console.group(...args); // eslint-disable-line no-console
  }

  groupCollapsed(...args) {
    console.groupCollapsed(...args); // eslint-disable-line no-console
  }

  groupEnd(...args) {
    console.groupEnd(...args); // eslint-disable-line no-console
  }

  log(...args) {
    console.log(...args); // eslint-disable-line no-console
  }
}
