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
import { normalize } from 'normalizr';
import { Map } from 'immutable';

import { getCurrentPlanName } from '../selectors/plans';
import RegisterNodesConstants from '../constants/RegisterNodesConstants';
import { notify } from './NotificationActions';
import { addNodes, fetchNodes } from './NodesActions';
import { nodeSchema } from '../normalizrSchemas/nodes';
import { runValidationGroups } from './ValidationsActions';

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

export const startNodesRegistration = nodes => dispatch => {
  // TODO(jtomasek): Once we are able to generate UUIDs for nodes,
  // add nodes to the list and add operation using startNodesOperation action.
  // Remove registerNodesReducer and track the progress on each node.
  // Introduce separate reducer for tracking operations: nodeOperationsById
  // dispatch(addNodes(nodes.map(node => new Node(node))));
  // dispatch(startOperation(nodes.map(node => node.uuid), 'register'))
  // addNodes(nodesToRegister.map(node => new Node))
  return dispatch(nodesRegistrationPending());
};

export const nodesRegistrationPending = () => ({
  type: RegisterNodesConstants.NODES_REGISTRATION_PENDING
});

export const nodesRegistrationFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const { output: { message, registered_nodes }, state } = execution;
  const registeredNodes =
    normalize(registered_nodes, [nodeSchema]).entities.nodes || Map();
  dispatch(addNodes(registeredNodes));
  // TODO(jtomasek): This should not be needed when workflow returns up to date nodes
  dispatch(fetchNodes());

  // run pre-introspection validations
  dispatch(
    runValidationGroups(['pre-introspection'], getCurrentPlanName(getState()))
  );

  switch (state) {
    case 'SUCCESS': {
      dispatch(
        notify({
          type: 'success',
          title: formatMessage(messages.registrationNotificationTitle),
          message: formatMessage(messages.registrationNotificationMessage)
        })
      );
      dispatch(nodesRegistrationSuccess());
      break;
    }
    case 'ERROR': {
      const errors = [
        {
          title: 'Nodes Registration Failed',
          message: message.message.filter(m => m.result).map(m => m.result)
        }
      ];
      // TODO(jtomasek): repopulate nodes registration form with failed nodes provided by message
      dispatch(nodesRegistrationFailed(errors));
      break;
    }
    default:
      break;
  }
};

export const nodesRegistrationSuccess = () => ({
  type: RegisterNodesConstants.NODES_REGISTRATION_SUCCESS
});

export const nodesRegistrationFailed = (errors, failedNodes) => ({
  type: RegisterNodesConstants.NODES_REGISTRATION_FAILED,
  payload: {
    errors: errors,
    failedNodes: failedNodes
  }
});
