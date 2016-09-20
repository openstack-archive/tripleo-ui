import { List, Map, Record } from 'immutable';

export const ParametersDefaultState = Record({
  loaded: false,
  isFetching: true,
  form: Map({
    formErrors: List(),
    formFieldErrors: Map()
  }),
  resourceTree: Map(),
  mistralParameters: Map()
});

export const Parameter = Record({
  Default: undefined,
  Description: undefined,
  Label: undefined,
  Name: undefined,
  NoEcho: undefined,
  Type: 'String'
});
