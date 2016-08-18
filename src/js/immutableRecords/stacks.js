import { Map, Record } from 'immutable';

export const StacksState = Record({
  isLoaded: false,
  isFetching: false,
  stacks: Map()
});

export const Stack = Record({
  id: '',
  resources: Map(),
  stack_name: '',
  stack_status: ''
});
