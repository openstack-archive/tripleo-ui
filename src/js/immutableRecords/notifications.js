import { Record } from 'immutable';

export const Notification = Record({
  id: undefined,
  title: '',
  message: '',
  type: 'error',
  viewed: false,
  dismissable: true,
  timeoutable: true,
  timestamp: undefined
});
