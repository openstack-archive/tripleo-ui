import { Map, Record } from 'immutable';

export const RolesState = Record({
  loaded: false,
  isFetching: false,
  roles: Map()
});

export const Role = Record({
  name: undefined,
  title: undefined,
  identifier: undefined
});
