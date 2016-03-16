import { List, Map, Record } from 'immutable';

export const ParametersDefaultState = Record({
  isPending: true,
  form: Map({
    formErrors: List(),
    formFieldErrors: Map()
  }),
  parameters: Map()
});

export const Parameter = Record({
  Default: undefined,
  Description: '',
  Label: undefined,
  Name: '',
  NoEcho: undefined,
  Parameters: undefined,
  NestedParameters: undefined,
  Type: ''
});
