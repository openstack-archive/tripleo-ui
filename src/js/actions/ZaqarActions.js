import MistralApiService from '../services/MistralApiService';
import NotificationActions from './NotificationActions';
import ZaqarWebSocketService from '../services/ZaqarWebSocketService';

export default {
  sendZaqarMessage() {
    return (dispatch, getState) => {
      ZaqarWebSocketService.subscribe('test_queue');
      MistralApiService.runAction('zaqar.queue_post',
                                  {queue_name: 'test_queue',
                                   messages: [{body:'I am a message a new one'}]});
    };
  },

  messageReceived(message) {
    return (dispatch, getState) => {
      dispatch(NotificationActions.notify({ title: 'Zaqar', message: message.body.message}));
    };
  }
};
