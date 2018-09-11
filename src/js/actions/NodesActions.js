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
import when from 'when';

import { getNodesByIds } from '../selectors/nodes';
import { handleErrors } from './ErrorActions';
import IronicApiService from '../services/IronicApiService';
import IronicInspectorApiService from '../services/IronicInspectorApiService';
import NodesConstants from '../constants/NodesConstants';
import { notify } from './NotificationActions';
import {
  nodeSchema,
  portSchema,
  introspectionStatusSchema
} from '../normalizrSchemas/nodes';
import MistralConstants from '../constants/MistralConstants';
import { setNodeCapability } from '../utils/nodes';
import { startWorkflow } from './WorkflowActions';
import { sanitizeMessage } from '../utils';

const messages = defineMessages({
  introspectionNotificationMessage: {
    id: 'NodesActions.introspectionNotificationMessage',
    defaultMessage: 'Selected nodes were successfully introspected.'
  },
  introspectionNotificationTitle: {
    id: 'NodesActions.introspectionNotificationTitle',
    defaultMessage: 'Nodes Introspection Complete'
  },
  introspectionFailedNotificationTitle: {
    id: 'NodesActions.introspectionFailedNotificationTitle',
    defaultMessage: 'Nodes Introspection Failed'
  },
  nodeIntrospectionFailedNotificationTitle: {
    id: 'NodesActions.nodeIntrospectionFailedNotificationTitle',
    defaultMessage: 'Node Introspection Failed'
  }
});

export const startOperation = nodeIds => ({
  type: NodesConstants.START_NODES_OPERATION,
  payload: nodeIds
});

export const finishOperation = nodeIds => ({
  type: NodesConstants.FINISH_NODES_OPERATION,
  payload: nodeIds
});

export const addNodes = nodes => ({
  type: NodesConstants.ADD_NODES,
  payload: nodes
});

export const requestNodes = () => ({
  type: NodesConstants.REQUEST_NODES
});

export const receiveNodes = entities => ({
  type: NodesConstants.RECEIVE_NODES,
  payload: entities
});

export const fetchNodes = () => (dispatch, getState) => {
  dispatch(requestNodes());
  return when
    .all([
      dispatch(IronicApiService.getNodes()),
      dispatch(IronicApiService.getPorts()),
      dispatch(IronicInspectorApiService.getIntrospectionStatuses())
    ])
    .then(response => {
      const nodes = normalize(response[0].nodes, [nodeSchema]).entities.nodes;
      const ports = normalize(response[1].ports, [portSchema]).entities.ports;
      const introspectionStatuses = normalize(response[2].introspection, [
        introspectionStatusSchema
      ]).entities.introspectionStatuses;
      dispatch(receiveNodes({ nodes, ports, introspectionStatuses }));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Nodes could not be loaded'));
      dispatch(receiveNodes({}));
    });
};

export const fetchNodeIntrospectionDataSuccess = (nodeId, data) => ({
  type: NodesConstants.FETCH_NODE_INTROSPECTION_DATA_SUCCESS,
  payload: { nodeId, data }
});

export const fetchNodeIntrospectionDataFailed = nodeId => ({
  type: NodesConstants.FETCH_NODE_INTROSPECTION_DATA_FAILED,
  payload: nodeId
});

export const fetchNodeIntrospectionData = nodeId => dispatch =>
  dispatch(IronicInspectorApiService.getIntrospectionData(nodeId))
    .then(response => {
      dispatch(fetchNodeIntrospectionDataSuccess(nodeId, response));
    })
    .catch(error => {
      dispatch(
        handleErrors(error, 'Node introspection data could not be loaded')
      );
      dispatch(fetchNodeIntrospectionDataFailed(nodeId));
    });

/*
   * Poll fetchNodes until no node is in progress
   */
export const pollNodeslistDuringProgress = () => (dispatch, getState) => {
  const nodesState = getState().nodes;
  if (nodesState.get('nodesInProgress').size > 0) {
    // Only fetch nodes if there's currently no unfinished request.
    if (!nodesState.get('isFetching')) {
      dispatch(fetchNodes());
    }
    setTimeout(() => {
      dispatch(pollNodeslistDuringProgress());
    }, 5000);
  }
};

export const startNodesIntrospection = nodeIds => (dispatch, getState) => {
  dispatch(startOperation(nodeIds));
  dispatch(pollNodeslistDuringProgress());
  // Nodes are introspected in batches of 20, each batch 15 minutes
  const timeout = Math.ceil(nodeIds.length / 20) * 15 * 60 * 1000;
  return dispatch(
    startWorkflow(
      MistralConstants.BAREMETAL_INTROSPECT,
      {
        node_uuids: nodeIds,
        max_retry_attempts: 1
      },
      nodesIntrospectionFinished,
      timeout
    )
  ).catch(error => {
    dispatch(handleErrors(error, 'Selected Nodes could not be introspected'));
    dispatch(finishOperation(nodeIds));
  });
};

export const nodesIntrospectionFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const {
    input: { node_uuids: nodeIds },
    output: { message },
    state
  } = execution;
  dispatch(finishOperation(nodeIds));
  dispatch(fetchNodes());

  switch (state) {
    case 'SUCCESS': {
      dispatch(
        notify({
          type: 'success',
          title: formatMessage(messages.introspectionNotificationTitle),
          message: formatMessage(messages.introspectionNotificationMessage)
        })
      );
      break;
    }
    case 'ERROR': {
      dispatch(
        notify({
          title: formatMessage(messages.introspectionFailedNotificationTitle),
          message: sanitizeMessage(message)
        })
      );
      break;
    }
    default:
      break;
  }
};

export const nodeIntrospectionFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const {
    input: { node_uuid: nodeId },
    output: { message },
    state
  } = execution;
  dispatch(finishOperation([nodeId]));

  if (state === 'ERROR') {
    dispatch(
      notify({
        title: formatMessage(messages.nodeIntrospectionFailedNotificationTitle),
        message: sanitizeMessage(message)
      })
    );
  }
};

export const tagNodes = (nodeIds, tag) => (dispatch, getState) => {
  const nodes = getNodesByIds(getState(), nodeIds);
  nodes.map(node => {
    dispatch(
      updateNode({
        uuid: node.get('uuid'),
        patches: [
          {
            op: 'replace',
            path: '/properties/capabilities',
            value: setNodeCapability(
              node.getIn(['properties', 'capabilities']),
              'profile',
              tag
            )
          }
        ]
      })
    );
  });
};

export const startProvideNodes = nodeIds => (dispatch, getState) => {
  dispatch(startOperation(nodeIds));
  dispatch(pollNodeslistDuringProgress());
  return dispatch(
    startWorkflow(
      MistralConstants.BAREMETAL_PROVIDE,
      { node_uuids: nodeIds },
      provideNodesFinished
    )
  ).catch(error => {
    dispatch(handleErrors(error, 'Selected Nodes could not be provided'));
    dispatch(finishOperation(nodeIds));
  });
};

export const provideNodesFinished = execution => (dispatch, getState) => {
  const { input, output, state } = execution;
  const nodeIds = input.node_uuids;
  dispatch(finishOperation(nodeIds));
  dispatch(fetchNodes());

  switch (state) {
    case 'SUCCESS': {
      dispatch(
        notify({
          type: 'success',
          title: 'Nodes are available',
          message: sanitizeMessage(output.message)
        })
      );
      break;
    }
    case 'ERROR': {
      dispatch(
        notify({
          title: 'Some Nodes could not be provided',
          message: sanitizeMessage(output.message)
        })
      );
      break;
    }
    default:
      break;
  }
};

export const startManageNodes = nodeIds => (dispatch, getState) => {
  dispatch(startOperation(nodeIds));
  dispatch(pollNodeslistDuringProgress());
  dispatch(
    startWorkflow(
      MistralConstants.BAREMETAL_MANAGE,
      { node_uuids: nodeIds },
      manageNodesFinished
    )
  ).catch(error => {
    dispatch(handleErrors(error, 'Selected Nodes could not be managed'));
    dispatch(finishOperation(nodeIds));
  });
};

export const manageNodesFinished = execution => (dispatch, getState) => {
  const {
    input: { node_uuids: nodeIds },
    output: { message },
    state
  } = execution;
  dispatch(finishOperation(nodeIds));
  dispatch(fetchNodes());

  switch (state) {
    case 'SUCCESS': {
      dispatch(
        notify({
          type: 'success',
          title: 'Nodes are manageable',
          message: sanitizeMessage(message)
        })
      );
      break;
    }
    case 'ERROR': {
      dispatch(
        notify({
          title: 'Some Nodes could not be managed',
          message: sanitizeMessage(message)
        })
      );
      break;
    }
    default:
      break;
  }
};

export const updateNode = nodePatch => (dispatch, getState) => {
  dispatch(updateNodePending(nodePatch.uuid));
  return dispatch(IronicApiService.patchNode(nodePatch))
    .then(response => {
      dispatch(updateNodeSuccess(response));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Node could not be updated'));
      dispatch(updateNodeFailed(nodePatch.uuid));
    });
};

export const updateNodePending = nodeId => ({
  type: NodesConstants.UPDATE_NODE_PENDING,
  payload: nodeId
});

export const updateNodeFailed = nodeId => ({
  type: NodesConstants.UPDATE_NODE_FAILED,
  payload: nodeId
});

export const updateNodeSuccess = node => ({
  type: NodesConstants.UPDATE_NODE_SUCCESS,
  payload: node
});

export const deleteNodes = nodeIds => dispatch => {
  dispatch(startOperation(nodeIds));
  return Promise.all(
    nodeIds.map(nodeId =>
      dispatch(IronicApiService.deleteNode(nodeId))
        .then(response => dispatch(deleteNodeSuccess(nodeId)))
        .catch(error => {
          dispatch(handleErrors(error, 'Node could not be deleted'));
          dispatch(deleteNodeFailed(nodeId));
        })
    )
  );
};

export const deleteNodeSuccess = nodeId => ({
  type: NodesConstants.DELETE_NODE_SUCCESS,
  payload: nodeId
});

export const deleteNodeFailed = nodeId => ({
  type: NodesConstants.DELETE_NODE_FAILED,
  payload: nodeId
});
