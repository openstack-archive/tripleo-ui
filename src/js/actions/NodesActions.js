import { normalize, arrayOf } from 'normalizr';
import { fromJS, List, Map } from 'immutable';
import when from 'when';

import IronicApiErrorHandler from '../services/IronicApiErrorHandler';
import IronicApiService from '../services/IronicApiService';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NodesConstants from '../constants/NodesConstants';
import NotificationActions from './NotificationActions';
import { nodeSchema } from '../normalizrSchemas/nodes';

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
      IronicApiService.getNodes().then((response) => {
        return when.all(response.nodes.map((node) => {
          return IronicApiService.getNode(node.uuid);
        }));
      }).then((nodes) => {
        const normalizedNodes = normalize(nodes, arrayOf(nodeSchema)).entities.nodes || Map();
        dispatch(this.receiveNodes(normalizedNodes));
      }).catch((error) => {
        dispatch(this.receiveNodes({}));
        console.error('Error in NodesActions.fetchNodes', error.stack || error); //eslint-disable-line no-console
        let errorHandler = new IronicApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  startNodesIntrospection(nodeIds) {
    return (dispatch, getState) => {
      dispatch(this.startOperation(nodeIds));
      MistralApiService.runWorkflow('tripleo.baremetal.v1.introspect',
                                    { node_uuids: nodeIds })
      .then((response) => {
        if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
          dispatch(this.finishOperation(nodeIds));
        }
      }).catch((error) => {
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

  updateNode(nodePatch) {
    return (dispatch, getState) => {
      dispatch(this.updateNodePending(nodePatch.uuid));
      IronicApiService.patchNode(nodePatch).then(response => {
        dispatch(this.updateNodeSuccess(response));
      }).catch(error => {
        dispatch(this.updateNodeFailed(nodePatch.uuid));
        console.error('Error in NodesActions.UpdateNode', error.stack || error); //eslint-disable-line no-console
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
      nodeIds.map((nodeId) => {
        IronicApiService.deleteNode(nodeId).then(response => {
          dispatch(this.deleteNodeSuccess(nodeId));
        }).catch(error => {
          dispatch(this.deleteNodeFailed(nodeId));
          console.error('Error in NodesActions.DeleteNodes', error.stack || error); //eslint-disable-line no-console
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
  }
};
