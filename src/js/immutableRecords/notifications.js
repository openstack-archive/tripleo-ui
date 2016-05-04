import { Record } from 'immutable';

export const Notification = new Record({
  id: undefined,
  title: '',
  message: '',
  type: 'error',
  viewed: false,
  dismissable: false,
  timestamp: undefined
});
