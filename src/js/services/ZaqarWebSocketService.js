import uuid from 'node-uuid';
import when from 'when';

import { getAuthTokenId, getProjectId, getServiceUrl } from './utils';
import { ZAQAR_DEFAULT_QUEUE } from '../constants/ZaqarConstants';
import ZaqarActions from '../actions/ZaqarActions';
import NotificationActions from '../actions/NotificationActions';
import logger from '../services/logger';

export default {
  socket: null,
  clientID: null,

  init(getState, dispatch) {
    when.try(getServiceUrl, 'zaqar-websocket').then(serviceUrl => {
      this.socket = new WebSocket(serviceUrl);
      this.clientID = uuid.v4();
      this.socket.onopen = () => {
        this.authenticate();
        this.createQueue(ZAQAR_DEFAULT_QUEUE);
        this.subscribe(ZAQAR_DEFAULT_QUEUE);
      };

      this.socket.onclose = function(evt) {};

      this.socket.onerror = function(error) {
        logger.error(
          'Zaqar WebSocket encountered error: ',
          error.message,
          'Closing Socket.'
        );
        dispatch(
          NotificationActions.notify({
            title: 'Zaqar WebSocket encountered Error',
            message: error.message
          })
        );
        this.close();
      };

      this.socket.onmessage = evt => {
        dispatch(ZaqarActions.messageReceived(JSON.parse(evt.data)));
      };
    });
  },

  authenticate() {
    const message = {
      action: 'authenticate',
      headers: {
        'X-Auth-Token': getAuthTokenId(),
        'Client-ID': this.clientID,
        'X-Project-ID': getProjectId()
      }
    };
    this.socket.send(JSON.stringify(message));
  },

  sendMessage(action, body = {}) {
    const message = {
      action: action,
      headers: {
        'Client-ID': this.clientID,
        'X-Project-ID': getProjectId()
      },
      body: body
    };
    this.socket.send(JSON.stringify(message));
  },

  createQueue(queueName) {
    this.sendMessage('queue_create', { queue_name: queueName });
  },

  subscribe(queueName, ttl = 3600) {
    this.sendMessage('subscription_create', {
      queue_name: queueName,
      ttl: ttl
    });
  },

  close() {
    this.socket && this.socket.close();
  }
};
