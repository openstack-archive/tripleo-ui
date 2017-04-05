import { browserHistory } from 'react-router';
import { defineMessages } from 'react-intl';
import { normalize, arrayOf } from 'normalizr';
import { Map } from 'immutable';

import RegisterNodesConstants from '../constants/RegisterNodesConstants';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import NodesActions from './NodesActions';
import { nodeSchema } from '../normalizrSchemas/nodes';
import ValidationsActions from './ValidationsActions';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logger';

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
      MistralApiService.runWorkflow(MistralConstants.BAREMETAL_REGISTER_OR_UPDATE,
                                    { nodes_json: nodes.toList().toJS(),
                                      kernel_name: 'bm-deploy-kernel',
                                      ramdisk_name: 'bm-deploy-ramdisk' })
      .then((response) => {
        if(response.state === 'ERROR') {
          const errors = [{ title: 'Nodes Registration Failed', message: response.state_info }];
          dispatch(this.startNodesRegistrationFailed(errors));
        } else {
          dispatch(this.startNodesRegistrationSuccess());
        }
      }).catch((error) => {
        logger.error('Error in RegisterNodesActions.startNodesRegistration', error);
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
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      //TODO(jtomasek): re-enable this after Nodes are stored as Records rather than Maps
      // const registeredNodes = normalize(messagePayload.registered_nodes,
      //                                   arrayOf(nodeSchema)).entities.nodes || Map();
      // dispatch(NodesActions.addNodes(registeredNodes));
      // TODO(jtomasek): This should not be needed when workflow returns up to date nodes
      dispatch(NodesActions.fetchNodes());

      // run pre-introspection validations
      dispatch(ValidationsActions.runValidationGroups(['pre-introspection'],
                                                      getState().currentPlan.currentPlanName));

      switch(messagePayload.status) {
      case 'SUCCESS': {
        dispatch(NotificationActions.notify({
          type: 'success',
          title: formatMessage(messages.registrationNotificationTitle),
          message: formatMessage(messages.registrationNotificationMessage)
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
