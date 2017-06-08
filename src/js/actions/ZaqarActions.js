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

import NodesActions from './NodesActions';
import PlansActions from './PlansActions';
import RegisterNodesActions from './RegisterNodesActions';
import ValidationsActions from './ValidationsActions';
import LoggerActions from './LoggerActions';
import MistralConstants from '../constants/MistralConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';

export default {
  initializeConnection(history) {
    return (dispatch, getState) => {
      ZaqarWebSocketService.init(getState, dispatch, history);
    };
  },

  messageReceived(message, history) {
    return (dispatch, getState) => {
      const { type, payload } = message.body;
      switch (type) {
        case MistralConstants.BAREMETAL_REGISTER_OR_UPDATE:
          dispatch(
            RegisterNodesActions.nodesRegistrationFinished(payload, history)
          );
          break;

        case MistralConstants.BAREMETAL_INTROSPECT:
          dispatch(NodesActions.nodesIntrospectionFinished(payload));
          break;

        case MistralConstants.BAREMETAL_PROVIDE:
          dispatch(NodesActions.provideNodesFinished(payload));
          break;

        case MistralConstants.VALIDATIONS_RUN: {
          dispatch(ValidationsActions.runValidationMessage(payload));
          break;
        }

        case MistralConstants.PLAN_CREATE: {
          dispatch(PlansActions.createPlanFinished(payload, history));
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
  }
};
