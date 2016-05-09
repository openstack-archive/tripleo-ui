import { normalize, arrayOf } from 'normalizr';
import { Map } from 'immutable';
import when from 'when';

import IronicApiErrorHandler from '../services/IronicApiErrorHandler';
import IronicApiService from '../services/IronicApiService';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NodesConstants from '../constants/NodesConstants';
import NotificationActions from './NotificationActions';
import { nodeSchema } from '../normalizrSchemas/nodes';

export default {
  startOperation(workflowId) {
    return {
      type: NodesConstants.START_NODES_OPERATION
    };
  },

  finishOperation() {
    return {
      type: NodesConstants.FINISH_NODES_OPERATION
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

  introspectNodes() {
    return (dispatch, getState) => {
      dispatch(this.startOperation());
      MistralApiService.runWorkflow('tripleo.baremetal.v1.bulk_introspect')
      .then((response) => {
        if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
          dispatch(this.finishOperation());
        } else {
          dispatch(this.pollForIntrospectionWorkflow(response.id));
        }
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.finishOperation());
      });
    };
  },

  pollForIntrospectionWorkflow(workflowExecutionId) {
    return (dispatch, getState) => {
      MistralApiService.getWorkflowExecution(workflowExecutionId)
      .then((response) => {
        if(response.state === 'RUNNING') {
          dispatch(this.fetchNodes());
          setTimeout(() => dispatch(this.pollForIntrospectionWorkflow(workflowExecutionId)), 5000);
        } else if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
          dispatch(this.finishOperation());
        } else {
          dispatch(this.finishOperation());
          dispatch(NotificationActions.notify({ type: 'success',
                                       title: 'Introspection finished',
                                       message: 'Nodes Introspection successfully finished' }));
        }
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.finishOperation());
      });
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
  }

};
