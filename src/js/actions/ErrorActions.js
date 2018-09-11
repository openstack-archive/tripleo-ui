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

import logger from '../services/logging/LoggingService';
import { userAuthFailure } from './LoginActions';
import { notify } from './NotificationActions';
import { sanitizeMessage } from '../utils';

export const handleErrors = (
  error,
  title = 'Error',
  doNotify = true
) => dispatch => {
  if (error.name === 'AuthenticationError') {
    dispatch(
      userAuthFailure([
        {
          title: 'Unauthorized',
          message: sanitizeMessage(error.message)
        }
      ])
    );
  } else {
    if (doNotify) {
      dispatch(notify({ title, message: sanitizeMessage(error.message) }));
    }
  }
  logger.error(title, error, error.stack);
};
