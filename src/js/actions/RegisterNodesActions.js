import { browserHistory } from 'react-router';
import { normalize, arrayOf } from 'normalizr';
import { Map } from 'immutable';

import RegisterNodesConstants from '../constants/RegisterNodesConstants';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import NodesActions from './NodesActions';
import { nodeSchema } from '../normalizrSchemas/nodes';

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
      MistralApiService.runWorkflow('tripleo.baremetal.v1.register_or_update',
                                    { nodes_json: nodes.toList().toJS() })
      .then((response) => {
        if(response.state === 'ERROR') {
          const errors = [{ title: 'Nodes Registration Failed', message: response.state_info }];
          dispatch(this.startNodesRegistrationFailed(errors));
        } else {
          dispatch(this.startNodesRegistrationSuccess());
        }
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        dispatch(this.startNodesRegistrationFailed(errorHandler.errors));
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

  nodesRegistrationFinished(messagePayload) {
    return (dispatch, getState) => {
      const registeredNodes = normalize(messagePayload.registered_nodes,
                                        arrayOf(nodeSchema)).entities.nodes || Map();
      dispatch(NodesActions.addNodes(registeredNodes));
      // TODO(jtomasek): This should not be needed when workflow returns up to date nodes
      dispatch(NodesActions.fetchNodes());

      switch(messagePayload.status) {
      case 'SUCCESS': {
        dispatch(NotificationActions.notify({
          type: 'success',
          title: 'Nodes Registration Complete',
          message: 'The nodes were successfully registered'
        }));
        dispatch(this.nodesRegistrationSuccess());
        browserHistory.push('/nodes/registered');
        break;
      }
      case 'FAILED': {
        const errors = [{
          title: 'Nodes Registration Failed',
          message: JSON.stringify(messagePayload.message)
        }];
        browserHistory.push('/nodes/registered/register');
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
