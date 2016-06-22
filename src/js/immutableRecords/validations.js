import { List, Map, Record } from 'immutable';

export const Validation = Record({
  description: '',
  groups: List(),
  id: undefined,
  metadata: undefined,
  name: undefined,
  results: Map()
});
