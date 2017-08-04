import { List, Map, Record } from 'immutable';

export const AppConfig = Record({
  endpoints: Map(),
  zaqarDefaultQueue: 'tripleo',
  excludedLanguages: List(),
  loggers: List(['console'])
});
