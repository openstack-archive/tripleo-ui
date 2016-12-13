import { List, Map, Record } from 'immutable';

export const EnvironmentConfigurationState = Record({
  loaded: false,
  isFetching: false,
  topics: Map(),
  environmentGroups: Map(),
  environments: Map(),
  form: Map({
    formErrors: List(),
    formFieldErrors: Map()
  })
});

export const Environment = Record({
  file: undefined,
  title: undefined,
  description: undefined,
  enabled: false,
  error: undefined,
  isFetching: false,
  requires: List(),
  resourceRegistry: Map(),
  parameterDefaults: Map()
});
