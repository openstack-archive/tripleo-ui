import { browserHistory } from 'react-router';

import RegisterNodesConstants from '../constants/RegisterNodesConstants';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';

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

  registerNodes(nodes, redirectPath) {
    return (dispatch, getState) => {
      dispatch(this.registerNodesPending(nodes));
      MistralApiService.runWorkflow('tripleo.baremetal.v1.bulk_register',
                                    { nodes: nodes.toList().toJS()})
      .then((response) => {
        if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
          dispatch(this.registerNodesFailed());
        } else {
          dispatch(NotificationActions.notify({ title: 'Success',
                                                message: 'Nodes registration initiated'}));
          browserHistory.push(redirectPath);
          dispatch(this.registerNodesSuccess());
        }
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.registerNodesFailed());
      });
    };
  },

  registerNodesPending(nodes) {
    return {
      type: RegisterNodesConstants.REGISTER_NODES_PENDING,
      payload: nodes
    };
  },

  registerNodesSuccess() {
    return {
      type: RegisterNodesConstants.REGISTER_NODES_SUCCESS
    };
  },

  registerNodesFailed() {
    return {
      type: RegisterNodesConstants.REGISTER_NODES_FAILED
    };
  }
};
