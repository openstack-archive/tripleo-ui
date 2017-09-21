import { List, Record } from 'immutable';

export const AppConfig = Record({
  keystone: undefined,
  heat: undefined,
  ironic: undefined,
  'ironic-inspector': undefined,
  mistral: undefined,
  swift: undefined,
  'zaqar-websocket': undefined,
  zaqarDefaultQueue: 'tripleo',
  excludedLanguages: List(),
  loggers: List(['console'])
});
