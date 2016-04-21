import { List, Map, Record } from 'immutable';

export const InitialEnvironmentConfigurationState = Record({
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
