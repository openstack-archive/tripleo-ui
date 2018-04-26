/**
 * Copyright 2018 Red Hat Inc.
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

import { isArray } from 'lodash';

/**
 * This function is used to sanitize message into string or array of strings
 * @param {any} message
 */
export const sanitizeMessage = message => {
  if (!message) {
    return '';
  } else if (typeof message === 'string') {
    return message;
  } else if (message.message) {
    return sanitizeMessage(message.message);
  } else if (message.result) {
    return sanitizeMessage(message.result);
  } else if (isArray(message)) {
    return message.map(m => sanitizeMessage(m));
  } else {
    return JSON.stringify(message);
  }
};
