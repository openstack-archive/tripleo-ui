import * as _ from 'lodash';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';

export default {
  sendZaqarMessage() {
    return (dispatch, getState) => {
      MistralApiService.runAction('zaqar.queue_post',
                                  {queue_name: 'tripleo',
                                   messages: [{body:'I am a message a new one'}]});
    };
  },

  messageReceived(message) {
    return (dispatch, getState) => {
      switch (true) {

      case (_.includes(['authenticate',
                        'subscription_create'], message.request.action)):
        dispatch(NotificationActions.notify({ type: 'success',
                                              title: 'Zaqar',
                                              message: message.body.message }));
        break;

      case (message.request.action === 'queue_create'):
        dispatch(NotificationActions.notify({ type: 'success',
                                              title: 'Zaqar',
                                              message: message.body }));
        break;

      default:
        dispatch(NotificationActions.notify({ type: 'success',
                                              title: 'Zaqar',
                                              message: message.body }));
      }
    };
  }
};
