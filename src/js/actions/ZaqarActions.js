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
import { normalize } from 'normalizr';

import { deploymentStates } from '../constants/DeploymentConstants';
import { getCurrentStack } from '../selectors/stacks';
import {
  authenticated,
  flushMessages,
  downloadLogsFinished,
  queueMessage
} from './LoggerActions';
import {
  nodesIntrospectionFinished,
  nodeIntrospectionFinished,
  provideNodesFinished,
  manageNodesFinished
} from './NodesActions';
import {
  createPlanFinished,
  updatePlanFinished,
  exportPlanFinished
} from './PlansActions';
import { nodesRegistrationFinished } from './RegisterNodesActions';
import {
  fetchAvailableRolesFinished,
  selectRolesFinished
} from './RolesActions';
import { fetchStacksSuccess, fetchResources } from './StacksActions';
import { stackSchema } from '../normalizrSchemas/stacks';
import MistralConstants from '../constants/MistralConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import { handleWorkflowMessage } from './WorkflowActions';
import {
  getDeploymentStatusSuccess,
  deploymentFinished,
  undeployFinished,
  configDownloadMessage,
  recoverDeploymentStatusFinished,
  getDeploymentFailuresFinished
} from './DeploymentActions';
import { fetchNetworksFinished } from './NetworksActions';

export default {
  handleAuthenticationSuccess(message, dispatch) {
    message = get(message, ['body', 'message']);

    if (message === 'Authentified.') {
      dispatch(authenticated());
      dispatch(flushMessages());
    }
  },

  messageReceived(message) {
    return (dispatch, getState) => {
      this.handleAuthenticationSuccess(message, dispatch);
      const { type, payload } = message.body;
      switch (type) {
        case MistralConstants.BAREMETAL_REGISTER_OR_UPDATE:
          dispatch(
            handleWorkflowMessage(
              payload.execution.id,
              nodesRegistrationFinished
            )
          );
          break;

        case MistralConstants.BAREMETAL_INTROSPECT:
          dispatch(
            handleWorkflowMessage(
              payload.execution_id,
              nodesIntrospectionFinished
            )
          );
          break;

        case MistralConstants.BAREMETAL_INTROSPECT_INTERNAL:
          dispatch(
            handleWorkflowMessage(
              payload.execution_id,
              nodeIntrospectionFinished
            )
          );
          break;

        case MistralConstants.BAREMETAL_PROVIDE:
          dispatch(
            handleWorkflowMessage(payload.execution_id, provideNodesFinished)
          );
          break;

        case MistralConstants.BAREMETAL_MANAGE:
          dispatch(
            handleWorkflowMessage(payload.execution_id, manageNodesFinished)
          );
          break;

        case MistralConstants.VALIDATIONS_RUN: {
          // TODO(jtomasek): this conditional is a workaround for proper handling
          // of a message notifying that validation workflow has started. In that
          // case we want to keep original polling interval.
          // Ideally, validation workflow would send a message with
          // different type rather than sending the same type on start and end
          let pollTimeout;
          if (payload.status === 'RUNNING') {
            pollTimeout = 30000;
          }
          dispatch(
            handleWorkflowMessage(payload.execution.id, undefined, pollTimeout)
          );
          break;
        }

        case MistralConstants.PLAN_CREATE: {
          dispatch(
            handleWorkflowMessage(payload.execution_id, createPlanFinished)
          );
          break;
        }

        case MistralConstants.PLAN_UPDATE: {
          dispatch(
            handleWorkflowMessage(payload.execution_id, updatePlanFinished)
          );
          break;
        }

        case MistralConstants.DEPLOYMENT_DEPLOY_PLAN: {
          if (payload.deployment_status === deploymentStates.DEPLOYING) {
            const { message, plan_name, deployment_status } = payload;
            dispatch(
              getDeploymentStatusSuccess(plan_name, {
                status: deployment_status,
                message
              })
            );
          } else {
            dispatch(
              handleWorkflowMessage(payload.execution_id, deploymentFinished)
            );
          }
          break;
        }

        case MistralConstants.HEAT_STACKS_LIST: {
          const stacks =
            normalize(payload.stacks, [stackSchema]).entities.stacks || {};
          dispatch(fetchStacksSuccess(stacks));

          // TODO(jtomasek): It would be nicer if we could identify that
          // stack has changed in the component and fetch resources there
          const { isFetchingResources } = getState().stacks;
          const currentStack = getCurrentStack(getState());
          if (!isFetchingResources && currentStack) {
            const { stack_name, id } = currentStack;
            dispatch(fetchResources(stack_name, id));
          }
        }

        case MistralConstants.CONFIG_DOWNLOAD_DEPLOY: {
          const { message, plan_name, deployment_status } = payload;
          // respond only to messages notifying on deployment_status
          if (deployment_status) {
            dispatch(
              getDeploymentStatusSuccess(plan_name, {
                status: deployment_status,
                message
              })
            );
          }
          break;
        }

        case MistralConstants.ANSIBLE_PLAYBOOK_DEPLOY_STEPS: {
          const { message, plan_name } = payload;
          dispatch(configDownloadMessage(plan_name, message));
          break;
        }

        case MistralConstants.UNDEPLOY_PLAN: {
          if (payload.deployment_status === deploymentStates.UNDEPLOYING) {
            const { message, plan_name, deployment_status } = payload;
            dispatch(
              getDeploymentStatusSuccess(plan_name, {
                status: deployment_status,
                message
              })
            );
          } else {
            dispatch(
              handleWorkflowMessage(payload.execution_id, undeployFinished)
            );
          }
          break;
        }

        case MistralConstants.RECOVER_DEPLOYMENT_STATUS:
          dispatch(
            handleWorkflowMessage(
              payload.execution.id,
              recoverDeploymentStatusFinished
            )
          );
          break;

        case MistralConstants.GET_DEPLOYMENT_FAILURES:
          dispatch(
            handleWorkflowMessage(
              payload.execution.id,
              getDeploymentFailuresFinished
            )
          );
          break;

        case MistralConstants.PLAN_EXPORT: {
          dispatch(
            handleWorkflowMessage(payload.execution_id, exportPlanFinished)
          );
          break;
        }

        case MistralConstants.DOWNLOAD_LOGS: {
          dispatch(
            handleWorkflowMessage(payload.execution.id, downloadLogsFinished)
          );
          break;
        }

        case MistralConstants.LIST_AVAILABLE_ROLES: {
          dispatch(
            handleWorkflowMessage(
              payload.execution.id,
              fetchAvailableRolesFinished
            )
          );
          break;
        }
        // TODO(jtomasek): change this back once underlining tripleo-common patch is fixed
        case MistralConstants.SELECT_ROLES: {
          // case 'tripleo.roles.v1.select_roles': {
          dispatch(
            handleWorkflowMessage(payload.execution.id, selectRolesFinished)
          );
          break;
        }

        case MistralConstants.NETWORK_LIST: {
          dispatch(
            handleWorkflowMessage(payload.execution.id, fetchNetworksFinished)
          );
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
        dispatch(queueMessage(message));
        return;
      }

      dispatch(ZaqarWebSocketService.sendMessage('message_post', message));
    };
  }
};
