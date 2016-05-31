import { browserHistory } from 'react-router';

import RegisterNodesConstants from '../constants/RegisterNodesConstants';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import NodesActions from './NodesActions';

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

  startNodesRegistration(nodes, redirectPath) {
    return (dispatch, getState) => {
      dispatch(this.startNodesRegistrationPending(nodes));
      MistralApiService.runWorkflow('tripleo.baremetal.v1.register',
                                    { nodes_json: nodes.toList().toJS(),
                                      service_host: '192.0.2.1' })
      .then((response) => {
        if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
          dispatch(this.startNodesRegistrationFailed());
        } else {
          dispatch(NotificationActions.notify({ type: 'success',
                                                title: 'Success',
                                                message: 'Nodes registration initiated'}));
          browserHistory.push(redirectPath);
          dispatch(this.startNodesRegistrationSuccess());
        }
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.startNodesRegistrationFailed());
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

  startNodesRegistrationFailed() {
    return {
      type: RegisterNodesConstants.START_NODES_REGISTRATION_FAILED
    };
  },

  registerNodesSuccess(messageData) {
    return (dispatch, getState) => {
      dispatch(NotificationActions.notify({
        type: 'success',
        title: messageData.message,
        message: 'The nodes were successfully registered'
      }));
      dispatch(NodesActions.fetchNodes());
    };
  }

  // registerNodesFailed(nodes) {
  //   return {
  //     type: RegisterNodesConstants.REGISTER_NODES_SUCCESS,
  //     payload: nodes
  //   };
  // }
};
