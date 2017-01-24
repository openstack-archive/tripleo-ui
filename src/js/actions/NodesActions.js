import { normalize, arrayOf } from 'normalizr';
import { fromJS, List } from 'immutable';
import when from 'when';
import { reduce } from 'lodash';

import IronicApiErrorHandler from '../services/IronicApiErrorHandler';
import IronicApiService from '../services/IronicApiService';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NodesConstants from '../constants/NodesConstants';
import NotificationActions from './NotificationActions';
import { nodeSchema } from '../normalizrSchemas/nodes';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logger';

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

  receiveNodes(nodes) {
    return {
      type: NodesConstants.RECEIVE_NODES,
      payload: nodes
    };
  },

  fetchNodes() {
    return (dispatch, getState) => {
      dispatch(this.requestNodes());
      IronicApiService.getNodes().then(response => {
        const normalizedNodes = normalize(response.nodes, arrayOf(nodeSchema)).entities.nodes || {};
        return when.map(Object.keys(normalizedNodes), nodeUUID => {
          return IronicApiService.getNodePorts(nodeUUID).then(response => {
            const macs = reduce(response.ports, (result, value) => {
              result.push(value.address);
              return result;
            }, []).join(', ');
            return {
              nodeUUID,
              macs
            };
          });
        }).then(values => {
          values.forEach(v => normalizedNodes[v.nodeUUID].macs = v.macs);
          dispatch(this.receiveNodes(normalizedNodes));
        });
      }).catch((error) => {
        dispatch(this.receiveNodes({}));
        logger.error('Error in NodesActions.fetchNodes', error.stack || error);
        let errorHandler = new IronicApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
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
      if(nodesState.get('nodesInProgress').size > 0) {
        // Only fetch nodes if there's currently no unfinished request.
        if(!nodesState.get('isFetching')) {
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
      MistralApiService.runWorkflow(MistralConstants.BAREMETAL_INTROSPECT,
                                    { node_uuids: nodeIds })
      .then((response) => {
        if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
          dispatch(this.finishOperation(nodeIds));
        }
      }).catch((error) => {
        logger.error('Error in NodesActions.startNodesIntrospection', error.stack || error);
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  nodesIntrospectionFinished(messagePayload) {
    return (dispatch, getState) => {
      const payload = fromJS(messagePayload);
      const nodeIds = payload.get('introspected_nodes').keys();
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch(messagePayload.status) {
      case 'SUCCESS': {
        dispatch(NotificationActions.notify({
          type: 'success',
          title: 'Nodes Introspection Complete',
          message: 'Selected nodes were successfully introspected'
        }));
        break;
      }
      case 'FAILED': {
        const nodeErrors = payload.get('introspected_nodes').reduce((nodeErrors, value, key) => {
          return nodeErrors.push(`${key}: ${value.get('error')}`);
        }, List());
        dispatch(NotificationActions.notify({
          type: 'error',
          title: payload.get('message'),
          message: nodeErrors.toArray().join(', ')
        }));
        break;
      }
      default:
        break;
      }
    };
  },

  startProvideNodes(nodeIds) {
    return (dispatch, getState) => {
      dispatch(this.startOperation(nodeIds));
      dispatch(this.pollNodeslistDuringProgress());
      MistralApiService.runWorkflow(MistralConstants.BAREMETAL_PROVIDE,
                                    { node_uuids: nodeIds })
      .then((response) => {
        if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
          dispatch(this.finishOperation(nodeIds));
        }
      }).catch((error) => {
        logger.error('Error in NodesActions.startProvideNodes', error.stack || error);
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.finishOperation(nodeIds));
      });
    };
  },

  provideNodesFinished(messagePayload) {
    return (dispatch, getState) => {
      const nodeIds = messagePayload.execution.input.node_uuids;
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch(messagePayload.status) {
      case 'SUCCESS': {
        dispatch(NotificationActions.notify({
          type: 'success',
          title: 'Nodes are available',
          message: messagePayload.message
        }));
        break;
      }
      case 'FAILED': {
        dispatch(NotificationActions.notify({
          type: 'error',
          title: 'Error',
          message: messagePayload.message
        }));
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
      IronicApiService.patchNode(nodePatch).then(response => {
        dispatch(this.updateNodeSuccess(response));
      }).catch(error => {
        dispatch(this.updateNodeFailed(nodePatch.uuid));
        logger.error('Error in NodesActions.UpdateNode', error.stack || error);
        let errorHandler = new IronicApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
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
      dispatch(this.pollNodeslistDuringProgress());
      nodeIds.map((nodeId) => {
        IronicApiService.deleteNode(nodeId).then(response => {
          dispatch(this.deleteNodeSuccess(nodeId));
        }).catch(error => {
          dispatch(this.deleteNodeFailed(nodeId));
          logger.error('Error in NodesActions.DeleteNodes', error.stack || error);
          let errorHandler = new IronicApiErrorHandler(error);
          errorHandler.errors.forEach((error) => {
            dispatch(NotificationActions.notify(error));
          });
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
  },

  startNodesAssignment(tagNodeIds, untagNodeIds, role, planName) {
    const flatNodes = tagNodeIds.concat(untagNodeIds);
    return (dispatch, getState) => {
      dispatch(this.startOperation(flatNodes));
      dispatch(this.pollNodeslistDuringProgress());
      MistralApiService.runWorkflow(MistralConstants.TAG_NODES,
        { tag_node_uuids: tagNodeIds, untag_node_uuids: untagNodeIds, role: role, plan: planName })
        .then((response) => {
          if(response.state === 'ERROR') {
            dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
            dispatch(this.finishOperation(flatNodes));
          }
        }).catch((error) => {
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach((error) => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.finishOperation(flatNodes));
        });
    };
  },

  nodesAssignmentFinished(messagePayload) {
    return (dispatch, getState) => {
      const nodeIds = messagePayload.execution.input.tag_node_uuids.concat(
        messagePayload.execution.input.untag_node_uuids);
      dispatch(this.finishOperation(nodeIds));
      dispatch(this.fetchNodes());

      switch(messagePayload.status) {
      case 'FAILED': {
        dispatch(NotificationActions.notify({
          type: 'error',
          title: 'Error',
          message: messagePayload.message
        }));
        break;
      }
      default:
        break;
      }
    };
  }
};
