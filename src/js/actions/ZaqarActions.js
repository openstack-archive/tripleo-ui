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

import { get } from 'lodash';
import LoggerActions from './LoggerActions';
import NodesActions from './NodesActions';
import PlansActions from './PlansActions';
import RegisterNodesActions from './RegisterNodesActions';
import ValidationsActions from './ValidationsActions';
import MistralConstants from '../constants/MistralConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';

export default {
  initializeConnection(history) {
    return (dispatch, getState) => {
      ZaqarWebSocketService.init(getState, dispatch, history);
    };
  },

  handleAuthenticationSuccess(message, dispatch) {
    message = get(message, ['body', 'message']);

    if (message === 'Authentified.') {
      dispatch(LoggerActions.authenticated());
      dispatch(LoggerActions.flushMessages());
    }
  },

  messageReceived(message, history) {
    return (dispatch, getState) => {
      this.handleAuthenticationSuccess(message, dispatch);
      const { type, payload } = message.body;
      switch (type) {
        case MistralConstants.BAREMETAL_REGISTER_OR_UPDATE:
          dispatch(
            RegisterNodesActions.nodesRegistrationFinished(payload, history)
          );
          break;
        // TODO(honza): Remove the internal workflow once this bug is resolved
        // https://bugs.launchpad.net/tripleo/+bug/1716671
        case MistralConstants.BAREMETAL_INTROSPECT:
        case MistralConstants.BAREMETAL_INTROSPECT_INTERNAL:
          dispatch(NodesActions.nodesIntrospectionFinished(payload));
          break;

        case MistralConstants.BAREMETAL_PROVIDE:
          dispatch(NodesActions.provideNodesFinished(payload));
          break;

        case MistralConstants.BAREMETAL_MANAGE:
          dispatch(NodesActions.manageNodesFinished(payload));
          break;

        case MistralConstants.VALIDATIONS_RUN: {
          dispatch(ValidationsActions.runValidationMessage(payload));
          break;
        }

        case MistralConstants.PLAN_CREATE: {
          dispatch(PlansActions.createPlanFinished(payload, history));
          break;
        }

        case MistralConstants.PLAN_UPDATE: {
          dispatch(PlansActions.updatePlanFinished(payload, history));
          break;
        }

        case MistralConstants.DEPLOYMENT_DEPLOY_PLAN: {
          dispatch(PlansActions.deployPlanFinished(payload));
          break;
        }

        case MistralConstants.PLAN_EXPORT: {
          dispatch(PlansActions.exportPlanFinished(payload));
          break;
        }

        case MistralConstants.DOWNLOAD_LOGS: {
          dispatch(LoggerActions.downloadLogsFinished(payload));
          break;
        }

        default:
          break;
      }
    };
  },

  postMessage(queueName, body, ttl = 3600) {
    return (dispatch, getState) => {
      const message = {
        queue_name: queueName,
        messages: [
          {
            body,
            ttl
          }
        ]
      };

      // Drop the message on the floor when there is no `store`
      if (!getState) {
        return;
      }

      if (!getState().logger.authenticated) {
        dispatch(LoggerActions.queueMessage(message));
        return;
      }

      ZaqarWebSocketService.sendMessage('message_post', message);
    };
  }
};
