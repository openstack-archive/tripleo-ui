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
import NotificationActions from './NotificationActions';
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

export default {
  startOperation(nodeIds) {
    return {
      type: NodesConstants.START_NODES_OPERATION,
      payload: nodeIds
    };
  },

  finishOperation(nodeIds) {
    return {
      type: NodesConstants.FINISH_NODES_OPERATION,
      payload: nodeIds
    };
  },

  addNodes(nodes) {
    return {
      type: NodesConstants.ADD_NODES,
      payload: nodes
    };
  },

  requestNodes() {
    return {
      type: NodesConstants.REQUEST_NODES
    };
  },

  receiveNodes(entities) {
    return {
      type: NodesConstants.RECEIVE_NODES,
      payload: entities
    };
  },

  fetchNodes() {
    return (dispatch, getState) => {
      dispatch(this.requestNodes());
      return when
        .all([
          dispatch(IronicApiService.getNodes()),
          dispatch(IronicApiService.getPorts()),
          dispatch(IronicInspectorApiService.getIntrospectionStatuses())
        ])
        .then(response => {
          const nodes = normalize(response[0].nodes, [nodeSchema]).entities
            .nodes;
          const ports = normalize(response[1].ports, [portSchema]).entities
            .ports;
          const introspectionStatuses = normalize(response[2].introspection, [
            introspectionStatusSchema
          ]).entities.introspectionStatuses;
          dispatch(this.receiveNodes({ nodes, ports, introspectionStatuses }));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Nodes could not be loaded'));
          dispatch(this.receiveNodes({}));
        });
    };
  },

  fetchNodeIntrospectionDataSuccess(nodeId, data) {
    return {
      type: NodesConstants.FETCH_NODE_INTROSPECTION_DATA_SUCCESS,
      payload: { nodeId, data }
    };
  },

  fetchNodeIntrospectionDataFailed(nodeId) {
    return {
      type: NodesConstants.FETCH_NODE_INTROSPECTION_DATA_FAILED,
      payload: nodeId
    };
  },

  fetchNodeIntrospectionData(nodeId) {
    return dispatch =>
      dispatch(IronicInspectorApiService.getIntrospectionData(nodeId))
        .then(response => {
          dispatch(this.fetchNodeIntrospectionDataSuccess(nodeId, response));
        })
        .catch(error => {
          dispatch(
            handleErrors(error, 'Node introspection data could not be loaded')
          );
          dispatch(this.fetchNodeIntrospectionDataFailed(nodeId));
        });
  },

  /*
   * Poll fetchNodes until no node is in progress
   */
  pollNodeslistDuringProgress() {
    return (dispatch, getState) => {
      const nodesState = getState().nodes;
      if (nodesState.get('nodesInProgress').size > 0) {
        // Only fetch nodes if there's currently no unfinished request.
        if (!nodesState.get('isFetching')) {
          dispatch(this.fetchNodes());
        }
        setTimeout(() => {
          dispatch(this.pollNodeslistDuringProgress());
        }, 5000);
      }
    };
  },

  startNodesIntrospection(nodeIds) {
    return (dispatch, getState) => {
      dispatch(this.startOperation(nodeIds));
      dispatch(this.pollNodeslistDuringProgress());
      // Nodes are introspected in batches of 20, each batch 15 minutes
      const timeout = Math.ceil(nodeIds.length / 20) * 15 * 60 * 1000;
      return dispatch(
        startWorkflow(
          MistralConstants.BAREMETAL_INTROSPECT,
          {
            node_uuids: nodeIds,
            max_retry_attempts: 1
          },
          this.nodesIntrospectionFinished,
          timeout
        )
      ).catch(error => {
        dispatch(
          handleErrors(error, 'Selected Nodes could not be introspected')
        );
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  nodesIntrospectionFinished(execution) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      const {
        input: { node_uuids: nodeIds },
        output: { message },
        state
      } = execution;
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch (state) {
        case 'SUCCESS': {
          dispatch(
            NotificationActions.notify({
              type: 'success',
              title: formatMessage(messages.introspectionNotificationTitle),
              message: formatMessage(messages.introspectionNotificationMessage)
            })
          );
          break;
        }
        case 'ERROR': {
          dispatch(
            NotificationActions.notify({
              title: formatMessage(
                messages.introspectionFailedNotificationTitle
              ),
              message: sanitizeMessage(message)
            })
          );
          break;
        }
        default:
          break;
      }
    };
  },

  nodeIntrospectionFinished(execution) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      const {
        input: { node_uuid: nodeId },
        output: { message },
        state
      } = execution;
      dispatch(this.finishOperation([nodeId]));

      if (state === 'ERROR') {
        dispatch(
          NotificationActions.notify({
            title: formatMessage(
              messages.nodeIntrospectionFailedNotificationTitle
            ),
            message: sanitizeMessage(message)
          })
        );
      }
    };
  },

  tagNodes(nodeIds, tag) {
    return (dispatch, getState) => {
      const nodes = getNodesByIds(getState(), nodeIds);
      nodes.map(node => {
        dispatch(
          this.updateNode({
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
  },

  startProvideNodes(nodeIds) {
    return (dispatch, getState) => {
      dispatch(this.startOperation(nodeIds));
      dispatch(this.pollNodeslistDuringProgress());
      return dispatch(
        startWorkflow(
          MistralConstants.BAREMETAL_PROVIDE,
          { node_uuids: nodeIds },
          this.provideNodesFinished
        )
      ).catch(error => {
        dispatch(handleErrors(error, 'Selected Nodes could not be provided'));
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  provideNodesFinished(execution) {
    const { input, output, state } = execution;
    return (dispatch, getState) => {
      const nodeIds = input.node_uuids;
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch (state) {
        case 'SUCCESS': {
          dispatch(
            NotificationActions.notify({
              type: 'success',
              title: 'Nodes are available',
              message: sanitizeMessage(output.message)
            })
          );
          break;
        }
        case 'ERROR': {
          dispatch(
            NotificationActions.notify({
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
  },

  startManageNodes(nodeIds) {
    return (dispatch, getState) => {
      dispatch(this.startOperation(nodeIds));
      dispatch(this.pollNodeslistDuringProgress());
      dispatch(
        startWorkflow(
          MistralConstants.BAREMETAL_MANAGE,
          { node_uuids: nodeIds },
          this.manageNodesFinished
        )
      ).catch(error => {
        dispatch(handleErrors(error, 'Selected Nodes could not be managed'));
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  manageNodesFinished(execution) {
    return (dispatch, getState) => {
      const {
        input: { node_uuids: nodeIds },
        output: { message },
        state
      } = execution;
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch (state) {
        case 'SUCCESS': {
          dispatch(
            NotificationActions.notify({
              type: 'success',
              title: 'Nodes are manageable',
              message: sanitizeMessage(message)
            })
          );
          break;
        }
        case 'ERROR': {
          dispatch(
            NotificationActions.notify({
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
  },

  updateNode(nodePatch) {
    return (dispatch, getState) => {
      dispatch(this.updateNodePending(nodePatch.uuid));
      return dispatch(IronicApiService.patchNode(nodePatch))
        .then(response => {
          dispatch(this.updateNodeSuccess(response));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Node could not be updated'));
          dispatch(this.updateNodeFailed(nodePatch.uuid));
        });
    };
  },

  updateNodePending(nodeId) {
    return {
      type: NodesConstants.UPDATE_NODE_PENDING,
      payload: nodeId
    };
  },

  updateNodeFailed(nodeId) {
    return {
      type: NodesConstants.UPDATE_NODE_FAILED,
      payload: nodeId
    };
  },

  updateNodeSuccess(node) {
    return {
      type: NodesConstants.UPDATE_NODE_SUCCESS,
      payload: node
    };
  },

  deleteNodes(nodeIds) {
    return dispatch => {
      dispatch(this.startOperation(nodeIds));
      return Promise.all(
        nodeIds.map(nodeId =>
          dispatch(IronicApiService.deleteNode(nodeId))
            .then(response => dispatch(this.deleteNodeSuccess(nodeId)))
            .catch(error => {
              dispatch(handleErrors(error, 'Node could not be deleted'));
              dispatch(this.deleteNodeFailed(nodeId));
            })
        )
      );
    };
  },

  deleteNodeSuccess(nodeId) {
    return {
      type: NodesConstants.DELETE_NODE_SUCCESS,
      payload: nodeId
    };
  },

  deleteNodeFailed(nodeId) {
    return {
      type: NodesConstants.DELETE_NODE_FAILED,
      payload: nodeId
    };
  }
};
