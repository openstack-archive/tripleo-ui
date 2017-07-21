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
import when from 'when';

import { getNodesByIds } from '../selectors/nodes';
import { handleErrors } from './ErrorActions';
import IronicInspectorApiErrorHandler
  from '../services/IronicInspectorApiErrorHandler';
import IronicApiService from '../services/IronicApiService';
import IronicInspectorApiService from '../services/IronicInspectorApiService';
import MistralApiService from '../services/MistralApiService';
import NodesConstants from '../constants/NodesConstants';
import NotificationActions from './NotificationActions';
import {
  nodeSchema,
  portSchema,
  introspectionStatusSchema
} from '../normalizrSchemas/nodes';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logging/LoggingService';
import { setNodeCapability } from '../utils/nodes';

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
      when
        .all([
          IronicApiService.getNodes(),
          IronicApiService.getPorts(),
          IronicInspectorApiService.getIntrospectionStatuses()
        ])
        .then(response => {
          const nodes = normalize(response[0].nodes, arrayOf(nodeSchema))
            .entities.nodes;
          const ports = normalize(response[1].ports, arrayOf(portSchema))
            .entities.ports;
          const introspectionStatuses = normalize(
            response[2].introspection,
            arrayOf(introspectionStatusSchema)
          ).entities.introspectionStatuses;
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
    return dispatch => {
      IronicInspectorApiService.getIntrospectionData(nodeId)
        .then(response => {
          dispatch(this.fetchNodeIntrospectionDataSuccess(nodeId, response));
        })
        .catch(error => {
          dispatch(this.fetchNodeIntrospectionDataFailed(nodeId));
          logger.error(
            'Error in NodesActions.fetchNodeIntrospectionData',
            error.stack || error
          );
          let errorHandler = new IronicInspectorApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
        });
    };
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
      MistralApiService.runWorkflow(MistralConstants.BAREMETAL_INTROSPECT, {
        node_uuids: nodeIds
      }).catch(error => {
        dispatch(
          handleErrors(error, 'Selected Nodes could not be introspected')
        );
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  nodesIntrospectionFinished(messagePayload) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      const nodeIds = messagePayload.execution.input.node_uuids;
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch (messagePayload.status) {
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
        case 'FAILED': {
          dispatch(
            NotificationActions.notify({
              title: formatMessage(
                messages.introspectionFailedNotificationTitle
              ),
              message: messagePayload.message
                .filter(m => m.message)
                .map(m => m.message)
            })
          );
          break;
        }
        default:
          break;
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
      MistralApiService.runWorkflow(MistralConstants.BAREMETAL_PROVIDE, {
        node_uuids: nodeIds
      }).catch(error => {
        dispatch(handleErrors(error, 'Selected Nodes could not be provided'));
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  provideNodesFinished(messagePayload) {
    return (dispatch, getState) => {
      const nodeIds = messagePayload.execution.input.node_uuids;
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch (messagePayload.status) {
        case 'SUCCESS': {
          dispatch(
            NotificationActions.notify({
              type: 'success',
              title: 'Nodes are available',
              message: messagePayload.message
            })
          );
          break;
        }
        case 'FAILED': {
          dispatch(
            NotificationActions.notify({
              title: 'Some Nodes could not be provided',
              message: messagePayload.message
                .filter(message => message.result)
                .map(message => message.result)
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
      MistralApiService.runWorkflow(MistralConstants.BAREMETAL_MANAGE, {
        node_uuids: nodeIds
      }).catch(error => {
        dispatch(handleErrors(error, 'Selected Nodes could not be managed'));
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  manageNodesFinished(messagePayload) {
    return (dispatch, getState) => {
      const nodeIds = messagePayload.execution.input.node_uuids;
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch (messagePayload.status) {
        case 'SUCCESS': {
          dispatch(
            NotificationActions.notify({
              type: 'success',
              title: 'Nodes are manageable',
              message: messagePayload.message
            })
          );
          break;
        }
        case 'FAILED': {
          dispatch(
            NotificationActions.notify({
              title: 'Some Nodes could not be managed',
              message: messagePayload.message
                .filter(message => message.result)
                .map(message => message.result)
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
      IronicApiService.patchNode(nodePatch)
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
    return (dispatch, getState) => {
      dispatch(this.startOperation(nodeIds));
      nodeIds.map(nodeId => {
        IronicApiService.deleteNode(nodeId)
          .then(response => {
            dispatch(this.deleteNodeSuccess(nodeId));
          })
          .catch(error => {
            dispatch(handleErrors(error, 'Node could not be deleted'));
            dispatch(this.deleteNodeFailed(nodeId));
          });
      });
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
