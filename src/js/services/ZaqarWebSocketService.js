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

import uuid from 'uuid';

import { getAuthTokenId, getProjectId, getServiceUrl } from '../selectors/auth';
import {
  getDefaultZaqarQueue,
  getLoggingZaqarQueue
} from '../selectors/appConfig';
import { messageReceived } from '../actions/ZaqarActions';
import { notify } from '../actions/NotificationActions';

// We're using `console` here to avoid circular imports.
const logger = {
  error: (...msg) => {
    console.log(...msg); // eslint-disable-line no-console
  }
};

export default {
  socket: null,
  clientID: null,

  init() {
    return (dispatch, getState) => {
      this.socket = new WebSocket(getServiceUrl(getState(), 'zaqar-websocket'));
      this.clientID = uuid.v4();
      this.socket.onopen = () => {
        dispatch(this.authenticate());
        dispatch(this.createQueue(getDefaultZaqarQueue(getState())));
        dispatch(this.createQueue(getLoggingZaqarQueue(getState())));
        dispatch(this.subscribe(getDefaultZaqarQueue(getState())));
      };

      this.socket.onclose = function(evt) {};

      this.socket.onerror = function(error) {
        logger.error(
          'Zaqar WebSocket encountered error: ',
          error.message,
          'Closing Socket.'
        );
        dispatch(
          notify({
            title: 'Zaqar WebSocket encountered Error',
            message: error.message
          })
        );
        this.close();
      };

      this.socket.onmessage = evt => {
        const data = JSON.parse(evt.data);
        dispatch(messageReceived(data));
      };
    };
  },

  authenticate() {
    return (dispatch, getState) => {
      const message = {
        action: 'authenticate',
        headers: {
          'X-Auth-Token': getAuthTokenId(getState()),
          'Client-ID': this.clientID,
          'X-Project-ID': getProjectId(getState())
        }
      };
      this.socket.send(JSON.stringify(message));
    };
  },

  sendMessage(action, body = {}) {
    return (dispatch, getState) => {
      const message = {
        action: action,
        headers: {
          'Client-ID': this.clientID,
          'X-Project-ID': getProjectId(getState())
        },
        body: body
      };
      this.socket.send(JSON.stringify(message));
    };
  },

  createQueue(queueName) {
    return dispatch =>
      dispatch(this.sendMessage('queue_create', { queue_name: queueName }));
  },

  subscribe(queueName, ttl = 3600) {
    return dispatch =>
      dispatch(
        this.sendMessage('subscription_create', {
          queue_name: queueName,
          ttl: ttl
        })
      );
  },

  close() {
    this.socket && this.socket.close();
  }
};
