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

import uuid from 'node-uuid'
import when from 'when'

import { getAuthTokenId, getProjectId, getServiceUrl } from './utils'
import {
  ZAQAR_DEFAULT_QUEUE,
  ZAQAR_LOGGING_QUEUE
} from '../constants/ZaqarConstants'
import ZaqarActions from '../actions/ZaqarActions'
import NotificationActions from '../actions/NotificationActions'

// We're using `console` here to avoid circular imports.
const logger = {
  error: (...msg) => {
    console.log(...msg) // eslint-disable-line no-console
  }
}

export default {
  socket: null,
  clientID: null,

  init(getState, dispatch, history) {
    when.try(getServiceUrl, 'zaqar-websocket').then(serviceUrl => {
      this.socket = new WebSocket(serviceUrl)
      this.clientID = uuid.v4()
      this.socket.onopen = () => {
        this.authenticate()
        this.createQueue(ZAQAR_DEFAULT_QUEUE)
        this.createQueue(ZAQAR_LOGGING_QUEUE)
        this.subscribe(ZAQAR_DEFAULT_QUEUE)
      }

      this.socket.onclose = function(evt) {}

      this.socket.onerror = function(error) {
        logger.error(
          'Zaqar WebSocket encountered error: ',
          error.message,
          'Closing Socket.'
        )
        dispatch(
          NotificationActions.notify({
            title: 'Zaqar WebSocket encountered Error',
            message: error.message
          })
        )
        this.close()
      }

      this.socket.onmessage = evt => {
        const data = JSON.parse(evt.data)
        dispatch(ZaqarActions.messageReceived(data, history))
      }
    })
  },

  authenticate() {
    const message = {
      action: 'authenticate',
      headers: {
        'X-Auth-Token': getAuthTokenId(),
        'Client-ID': this.clientID,
        'X-Project-ID': getProjectId()
      }
    }
    this.socket.send(JSON.stringify(message))
  },

  sendMessage(action, body = {}) {
    const message = {
      action: action,
      headers: {
        'Client-ID': this.clientID,
        'X-Project-ID': getProjectId()
      },
      body: body
    }
    this.socket.send(JSON.stringify(message))
  },

  createQueue(queueName) {
    this.sendMessage('queue_create', { queue_name: queueName })
  },

  subscribe(queueName, ttl = 3600) {
    this.sendMessage('subscription_create', {
      queue_name: queueName,
      ttl: ttl
    })
  },

  close() {
    this.socket && this.socket.close()
  }
}
