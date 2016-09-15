import { Map, Record } from 'immutable';

export const StacksState = Record({
  isLoaded: false,
  isFetching: false,
  stacks: Map(),
  overcloud: Map()
});

export const Stack = Record({
  stack_name: '',
  stack_status: '',
  id: ''
});
