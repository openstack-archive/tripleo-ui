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

import { defineMessages } from 'react-intl';
import LoggerConstants from '../constants/LoggerConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import MistralConstants from '../constants/MistralConstants';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NotificationActions from '../actions/NotificationActions';
import { getAppConfig } from '../services/utils';
import logger from '../services/logging/LoggingService';

const messages = defineMessages({
  downloadLogsFailedNotificationTitle: {
    id: 'LoggerActions.downloadLogsFailedNotificationTitle',
    defaultMessage: 'Download logs failed'
  }
});

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
      const messages = getState().logger.get('messages', []);

      ZaqarWebSocketService.flushMessages(messages).then(() => {
        dispatch(this.flushMessagesSuccess());
      });
    };
  },

  authenticated() {
    return {
      type: LoggerConstants.WS_AUTHENTICATION_SUCCESS
    };
  },

  downloadLogsPending() {
    return {
      type: LoggerConstants.DOWNLOAD_LOGS_PENDING
    };
  },

  downloadLogsSuccess(url) {
    return {
      type: LoggerConstants.DOWNLOAD_LOGS_SUCCESS,
      payload: url
    };
  },

  downloadLogsFailed() {
    return {
      type: LoggerConstants.DOWNLOAD_LOGS_FAILED
    };
  },

  downloadLogsFinished(payload) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      if (payload.status === 'FAILED' || !payload.tempurl) {
        dispatch(this.downloadLogsFailed());
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.downloadLogsFailedNotificationTitle),
            message: payload.message,
            type: 'error'
          })
        );
      } else {
        let urlParser = document.createElement('a');
        urlParser.href = payload.tempurl;
        let url = urlParser.hostname;
        urlParser.href = getAppConfig().swift;
        let swiftUrl = urlParser.hostname;
        dispatch(
          this.downloadLogsSuccess(payload.tempurl.replace(url, swiftUrl))
        );
      }
    };
  },

  downloadLogs() {
    return dispatch => {
      dispatch(this.downloadLogsPending());
      MistralApiService.runWorkflow(MistralConstants.DOWNLOAD_LOGS, {})
        .then(response => {
          if (response.state === 'ERROR') {
            logger.error('Error in LoggerActions.downloadLogs', response);
            dispatch(this.downloadLogsFailed());
          }
        })
        .catch(error => {
          logger.error('Error in LoggerActions.downloadLogs', error);
          dispatch(this.downloadLogsFailed());
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
        });
    };
  }
};
