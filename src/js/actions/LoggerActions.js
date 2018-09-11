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
import { defineMessages } from 'react-intl';

import { handleErrors } from './ErrorActions';
import LoggerConstants from '../constants/LoggerConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import { notify } from '../actions/NotificationActions';
import MistralConstants from '../constants/MistralConstants';
import { getServiceUrl } from '../selectors/auth';
import { startWorkflow } from './WorkflowActions';
import { sanitizeMessage } from '../utils';
import { generateDownloadUrl } from './utils';

const messages = defineMessages({
  downloadLogsFailedNotificationTitle: {
    id: 'LoggerActions.downloadLogsFailedNotificationTitle',
    defaultMessage: 'Download logs failed'
  }
});

export const queueMessage = message => ({
  type: LoggerConstants.QUEUE_MESSAGE,
  payload: message
});

export const flushMessagesSuccess = () => ({
  type: LoggerConstants.FLUSH_MESSAGES_SUCCESS
});

export const flushMessages = () => (dispatch, getState) => {
  const messages = getState().logger.messages;

  when
    .all(() => {
      messages.map(message => {
        ZaqarWebSocketService.sendMessage('message_post', message);
      });
    })
    .then(() => {
      dispatch(flushMessagesSuccess());
    })
    .catch(error => {
      // We're using `console` here to avoid circular imports.
      console.error(error); // eslint-disable-line no-console
      dispatch(
        notify({
          title: 'Logging error',
          message: 'Failed to flush Zaqar messages.'
        })
      );
    });
};

export const authenticated = () => ({
  type: LoggerConstants.WS_AUTHENTICATION_SUCCESS
});

export const downloadLogsPending = () => ({
  type: LoggerConstants.DOWNLOAD_LOGS_PENDING
});

export const downloadLogsSuccess = url => ({
  type: LoggerConstants.DOWNLOAD_LOGS_SUCCESS,
  payload: url
});

export const downloadLogsFailed = () => ({
  type: LoggerConstants.DOWNLOAD_LOGS_FAILED
});

export const downloadLogsFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const { output: { tempurl, message }, state } = execution;
  if (state === 'ERROR' || !tempurl) {
    dispatch(downloadLogsFailed());
    dispatch(
      notify({
        title: formatMessage(messages.downloadLogsFailedNotificationTitle),
        message: sanitizeMessage(message),
        type: 'error'
      })
    );
  } else {
    dispatch(
      this.downloadLogsSuccess(
        generateDownloadUrl(tempurl, getServiceUrl(getState(), 'swift'))
      )
    );
  }
};

export const downloadLogs = () => dispatch => {
  dispatch(downloadLogsPending());
  dispatch(
    startWorkflow(MistralConstants.DOWNLOAD_LOGS, {}, downloadLogsFinished)
  ).catch(error => {
    dispatch(handleErrors(error, 'Failed to download logs'));
    dispatch(downloadLogsFailed());
  });
};
