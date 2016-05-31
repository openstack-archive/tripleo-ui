import * as _ from 'lodash';
import NotificationActions from './NotificationActions';
import RegisterNodesActions from './RegisterNodesActions';

export default {
  messageReceived(message) {
    return (dispatch, getState) => {
      switch (true) {

      case (message.request &&
            _.includes(['authenticate', 'subscription_create'], message.request.action)):
        dispatch(NotificationActions.notify({ type: 'success',
                                              title: 'Zaqar',
                                              message: message.body.message }));
        break;

      case (message.request && message.request.action === 'queue_create'):
        dispatch(NotificationActions.notify({ type: 'success',
                                              title: 'Zaqar',
                                              message: message.body }));
        break;

      case (message.body.type === 'tripleo.baremetal.v1.register' &&
            message.body.payload.status === 'SUCCESS'):
        dispatch(RegisterNodesActions.registerNodesSuccess(message.body.payload));
        break;

      case (message.body.type === 'tripleo.baremetal.v1.register' &&
            message.body.payload.status === 'FAILED'):
        dispatch(RegisterNodesActions.registerNodesFailed(message.body.payload));
        break;

      default:
        dispatch(NotificationActions.notify({ type: 'success',
                                              title: 'Zaqar',
                                              message: JSON.stringify(message.body) }));
      }
    };
  }
};
