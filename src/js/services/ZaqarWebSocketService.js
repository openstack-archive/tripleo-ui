import uuid from 'node-uuid';

import { getAuthTokenId, getTenantId } from './utils';
import { ZAQAR_WEBSOCKET_URL, ZAQAR_DEFAULT_QUEUE } from '../constants/ZaqarConstants';
import ZaqarActions from '../actions/ZaqarActions';
import NotificationActions from '../actions/NotificationActions';

export default {
  socket: null,
  clientID: null,

  init(getState, dispatch) {
    // TODO(jtomasek): get the url from keystone endpoint list when it is included
    this.socket = new WebSocket(ZAQAR_WEBSOCKET_URL);
    this.clientID = uuid.v4();
    this.socket.onopen = () => {
      this.authenticate();
      this.createQueue(ZAQAR_DEFAULT_QUEUE);
      this.subscribe(ZAQAR_DEFAULT_QUEUE);
    };

    this.socket.onclose = function (evt) {};

    this.socket.onerror = function (error) {
      console.error('Zaqar WebSocket encountered error: ', error.message, 'Closing Socket.'); // eslint-disable-line no-console
      dispatch(NotificationActions.notify({ title: 'Zaqar WebSocket encountered Error',
                                            message: error.message }));
      this.close();
    };

    this.socket.onmessage = (evt) => {
      dispatch(ZaqarActions.messageReceived(JSON.parse(evt.data)));
    };
  },

  authenticate() {
    const message = {
      action: 'authenticate',
      headers: {
        'X-Auth-Token': getAuthTokenId(),
        'Client-ID': this.clientID,
        'X-Project-ID': getTenantId()
      }
    };
    this.socket.send(JSON.stringify(message));
  },

  sendMessage(action, body={}) {
    const message = {
      action: action,
      headers: {
        'Client-ID': this.clientID,
        'X-Project-ID': getTenantId()
      },
      body: body
    };
    this.socket.send(JSON.stringify(message));
  },

  createQueue(queueName) {
    this.sendMessage('queue_create', { queue_name: queueName });
  },

  subscribe(queueName, ttl=3600) {
    this.sendMessage('subscription_create', { queue_name: queueName, ttl: ttl });
  },

  close() {
    this.socket.close();
  }
};
