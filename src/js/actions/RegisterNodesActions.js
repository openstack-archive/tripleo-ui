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
import { normalize, arrayOf } from 'normalizr';
import { Map } from 'immutable';

import { getCurrentPlanName } from '../selectors/plans';
import { handleErrors } from './ErrorActions';
import RegisterNodesConstants from '../constants/RegisterNodesConstants';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import NodesActions from './NodesActions';
import { nodeSchema } from '../normalizrSchemas/nodes';
import ValidationsActions from './ValidationsActions';
import MistralConstants from '../constants/MistralConstants';

const messages = defineMessages({
  registrationNotificationTitle: {
    id: 'RegisterNodesActions.registrationNotificationTitle',
    defaultMessage: 'Nodes Registration Complete'
  },
  registrationNotificationMessage: {
    id: 'RegisterNodesActions.registrationNotificationMessage',
    defaultMessage: 'The nodes were successfully registered.'
  }
});

export default {
  addNode(node) {
    return {
      type: RegisterNodesConstants.ADD_NODE,
      payload: node
    };
  },

  selectNode(id) {
    return {
      type: RegisterNodesConstants.SELECT_NODE,
      payload: id
    };
  },

  removeNode(id) {
    return {
      type: RegisterNodesConstants.REMOVE_NODE,
      payload: id
    };
  },

  updateNode(node) {
    return {
      type: RegisterNodesConstants.UPDATE_NODE,
      payload: node
    };
  },

  startNodesRegistration(nodes) {
    return (dispatch, getState) => {
      dispatch(this.startNodesRegistrationPending(nodes));
      MistralApiService.runWorkflow(
        MistralConstants.BAREMETAL_REGISTER_OR_UPDATE,
        {
          nodes_json: nodes.toList().toJS(),
          kernel_name: 'bm-deploy-kernel',
          ramdisk_name: 'bm-deploy-ramdisk'
        }
      )
        .then(response => {
          dispatch(this.startNodesRegistrationSuccess());
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Nodes registration failed', false));
          dispatch(
            this.startNodesRegistrationFailed([
              { title: 'Nodes registration failed', message: error.message }
            ])
          );
        });
    };
  },

  startNodesRegistrationPending(nodes) {
    return {
      type: RegisterNodesConstants.START_NODES_REGISTRATION_PENDING,
      payload: nodes
    };
  },

  startNodesRegistrationSuccess() {
    return {
      type: RegisterNodesConstants.START_NODES_REGISTRATION_SUCCESS
    };
  },

  startNodesRegistrationFailed(errors) {
    return {
      type: RegisterNodesConstants.START_NODES_REGISTRATION_FAILED,
      payload: errors
    };
  },

  nodesRegistrationFinished(messagePayload, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      const registeredNodes =
        normalize(messagePayload.registered_nodes, arrayOf(nodeSchema)).entities
          .nodes || Map();
      dispatch(NodesActions.addNodes(registeredNodes));
      // TODO(jtomasek): This should not be needed when workflow returns up to date nodes
      dispatch(NodesActions.fetchNodes());

      // run pre-introspection validations
      dispatch(
        ValidationsActions.runValidationGroups(
          ['pre-introspection'],
          getCurrentPlanName(getState())
        )
      );

      switch (messagePayload.status) {
        case 'SUCCESS': {
          dispatch(
            NotificationActions.notify({
              type: 'success',
              title: formatMessage(messages.registrationNotificationTitle),
              message: formatMessage(messages.registrationNotificationMessage)
            })
          );
          dispatch(this.nodesRegistrationSuccess());
          history.push('/nodes');
          break;
        }
        case 'FAILED': {
          const errors = [
            {
              title: 'Nodes Registration Failed',
              message: messagePayload.message.message
                .filter(m => m.result)
                .map(m => m.result)
            }
          ];
          history.push('/nodes/register');
          // TODO(jtomasek): repopulate nodes registration form with failed nodes provided by message
          dispatch(this.nodesRegistrationFailed(errors));
          break;
        }
        default:
          break;
      }
    };
  },

  nodesRegistrationSuccess() {
    return {
      type: RegisterNodesConstants.NODES_REGISTRATION_SUCCESS
    };
  },

  nodesRegistrationFailed(errors, failedNodes) {
    return {
      type: RegisterNodesConstants.NODES_REGISTRATION_FAILED,
      payload: {
        errors: errors,
        failedNodes: failedNodes
      }
    };
  },

  cancelNodesRegistration() {
    return {
      type: RegisterNodesConstants.CANCEL_NODES_REGISTRATION
    };
  }
};
