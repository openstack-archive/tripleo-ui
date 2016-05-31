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

      case (message.body.name === 'tripleo.baremetal.v1.register'):
        dispatch(RegisterNodesActions.registerNodesSuccess(message.body.data));
        break;

      default:
        dispatch(NotificationActions.notify({ type: 'success',
                                              title: 'Zaqar',
                                              message: JSON.stringify(message.body) }));
      }
    };
  }
};
