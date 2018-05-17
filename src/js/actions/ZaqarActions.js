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
import LoggerActions from './LoggerActions';
import NodesActions from './NodesActions';
import PlansActions from './PlansActions';
import RegisterNodesActions from './RegisterNodesActions';
import RolesActions from './RolesActions';
import StacksActions from './StacksActions';
import { stackSchema } from '../normalizrSchemas/stacks';
import MistralConstants from '../constants/MistralConstants';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';
import { handleWorkflowMessage } from './WorkflowActions';
import {
  getDeploymentStatusSuccess,
  deploymentFinished,
  undeployFinished,
  configDownloadMessage,
  recoverDeploymentStatusFinished
} from './DeploymentActions';

export default {
  handleAuthenticationSuccess(message, dispatch) {
    message = get(message, ['body', 'message']);

    if (message === 'Authentified.') {
      dispatch(LoggerActions.authenticated());
      dispatch(LoggerActions.flushMessages());
    }
  },

  messageReceived(message) {
    return (dispatch, getState) => {
      this.handleAuthenticationSuccess(message, dispatch);
      const { type, payload } = message.body;
      switch (type) {
        case MistralConstants.BAREMETAL_REGISTER_OR_UPDATE:
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(
                RegisterNodesActions.nodesRegistrationFinished(execution)
              )
            )
          );
          break;

        case MistralConstants.BAREMETAL_INTROSPECT:
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(NodesActions.nodesIntrospectionFinished(execution))
            )
          );
          break;

        case MistralConstants.BAREMETAL_INTROSPECT_INTERNAL:
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(NodesActions.nodeIntrospectionFinished(execution))
            )
          );
          break;

        case MistralConstants.BAREMETAL_PROVIDE:
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(NodesActions.provideNodesFinished(execution))
            )
          );
          break;

        case MistralConstants.BAREMETAL_MANAGE:
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(NodesActions.manageNodesFinished(execution))
            )
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
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(PlansActions.createPlanFinished(execution))
            )
          );
          break;
        }

        case MistralConstants.PLAN_UPDATE: {
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(PlansActions.updatePlanFinished(execution))
            )
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
              handleWorkflowMessage(payload.execution_id, execution =>
                dispatch(deploymentFinished(execution))
              )
            );
          }
          break;
        }

        case MistralConstants.HEAT_STACKS_LIST: {
          const stacks =
            normalize(payload.stacks, [stackSchema]).entities.stacks || {};
          dispatch(StacksActions.fetchStacksSuccess(stacks));

          // TODO(jtomasek): It would be nicer if we could identify that
          // stack has changed in the component and fetch resources there
          const { isFetchingResources } = getState().stacks;
          const currentStack = getCurrentStack(getState());
          if (!isFetchingResources && currentStack) {
            const { stack_name, id } = currentStack;
            dispatch(StacksActions.fetchResources(stack_name, id));
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
              handleWorkflowMessage(payload.execution_id, execution =>
                dispatch(undeployFinished(execution))
              )
            );
          }
          break;
        }

        case MistralConstants.RECOVER_DEPLOYMENT_STATUS:
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(recoverDeploymentStatusFinished(execution))
            )
          );
          break;

        case MistralConstants.PLAN_EXPORT: {
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(PlansActions.exportPlanFinished(execution))
            )
          );
          break;
        }

        case MistralConstants.DOWNLOAD_LOGS: {
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(LoggerActions.downloadLogsFinished(execution))
            )
          );
          break;
        }

        case MistralConstants.LIST_AVAILABLE_ROLES: {
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(RolesActions.fetchAvailableRolesFinished(execution))
            )
          );
          break;
        }
        // TODO(jtomasek): change this back once underlining tripleo-common patch is fixed
        case MistralConstants.SELECT_ROLES: {
          // case 'tripleo.roles.v1.select_roles': {
          dispatch(
            handleWorkflowMessage(payload.execution.id, execution =>
              dispatch(RolesActions.selectRolesFinished(execution))
            )
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
        dispatch(LoggerActions.queueMessage(message));
        return;
      }

      dispatch(ZaqarWebSocketService.sendMessage('message_post', message));
    };
  }
};
