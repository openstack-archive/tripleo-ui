import { List, Map, Record } from 'immutable';

export const ParametersDefaultState = Record({
  loaded: false,
  isFetching: true,
  form: Map({
    formErrors: List(),
    formFieldErrors: Map()
  }),
  resources: Map(),
  parameters: Map(),
  mistralParameters: Map()
});

export const Parameter = Record({
  default: undefined,
  description: undefined,
  label: undefined,
  name: undefined,
  noEcho: undefined,
  type: 'string',
  value: undefined
});

export const Resource = Record({
  description: undefined,
  id: undefined,
  name: undefined,
  nestedParameters: List(),
  parameters: List(),
  type: undefined
});
