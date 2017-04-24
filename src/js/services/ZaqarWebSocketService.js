import uuid from 'node-uuid';
import when from 'when';

import { getAuthTokenId, getProjectId, getServiceUrl } from './utils';
import { ZAQAR_DEFAULT_QUEUE } from '../constants/ZaqarConstants';
import ZaqarActions from '../actions/ZaqarActions';
import NotificationActions from '../actions/NotificationActions';

// We're using `console` here to avoid circular imports.
const logger = {
  error: (...msg) => {
    console.log(...msg); // eslint-disable-line no-console
  }
};

export default {
  socket: null,
  clientID: null,
  auth: false,
  pendingMessages: [],

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
        const data = JSON.parse(evt.data);

        if (
          data &&
          data.body &&
          data.body.message &&
          data.body.message === 'Authentified.'
        ) {
          this.auth = true;
          this.flushPendingMessages();
        }

        dispatch(ZaqarActions.messageReceived(data));
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

  flushPendingMessages() {
    this.pendingMessages.map(message => {
      this.sendMessage('message_post', message);
    });

    this.pendingMessages = [];
  },

  postMessage(queueName, body, ttl = 3600) {
    const message = {
      queue_name: queueName,
      messages: [
        {
          body,
          ttl
        }
      ]
    };

    if (!this.auth) {
      this.pendingMessages.push(message);
      return;
    }

    this.sendMessage('message_post', message);
  },

  close() {
    this.socket && this.socket.close();
  }
};
