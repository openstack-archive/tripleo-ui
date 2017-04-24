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

import when from 'when';
import LoggerConstants from '../constants/LoggerConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import NotificationActions from '../actions/NotificationActions';

export default {
  queueMessage(message) {
    return {
      type: LoggerConstants.QUEUE_MESSAGE,
      payload: message
    };
  },

  flushMessagesSuccess() {
    return {
      type: LoggerConstants.FLUSH_MESSAGES_SUCCESS
    };
  },

  flushMessages() {
    return (dispatch, getState) => {
      const messages = getState().logger.messages;

      when
        .all(() => {
          messages.map(message => {
            ZaqarWebSocketService.sendMessage('message_post', message);
          });
        })
        .then(() => {
          dispatch(this.flushMessagesSuccess());
        })
        .catch(error => {
          // We're using `console` here to avoid circular imports.
          console.error(error); // eslint-disable-line no-console
          dispatch(
            NotificationActions.notify({
              title: 'Logging error',
              message: 'Failed to flush Zaqar messages.'
            })
          );
        });
    };
  },

  authenticated() {
    return {
      type: LoggerConstants.WS_AUTHENTICATION_SUCCESS
    };
  }
};
