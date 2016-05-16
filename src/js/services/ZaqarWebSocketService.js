import uuid from 'node-uuid';

import { getAuthTokenId, getTenantId } from './utils';
import ZaqarActions from '../actions/ZaqarActions';

export default {
  socket: null,
  clientID: null,

  init(getState, dispatch) {
    // TODO(jtomasek): get the url from keystone endpoint list when it is included
    this.socket = new WebSocket('ws://192.0.2.1:9000');
    this.clientID = uuid.v4();
    this.socket.onopen = () => {
      console.log('Connection opened');
      this._authenticate();
    };

    this.socket.onclose = function (evt) {
      console.log('Connection closed');
    };

    this.socket.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    };

    this.socket.onmessage = (evt) => {
      console.log('Server: ' + evt.data);
      dispatch(ZaqarActions.messageReceived(JSON.parse(evt.data)));
    };
  },

  _authenticate() {
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

  close() {
    this.socket.close();
  },

  subscribe(queueName, ttl=3600) {
    const message = {
      action: 'subscription_create',
      headers: {
        'Client-ID': this.clientID,
        'X-Project-ID': getTenantId()
      },
      body: {
        queue_name: queueName,
        ttl: ttl
      }
    };
    this.socket.send(JSON.stringify(message));
  }
};
