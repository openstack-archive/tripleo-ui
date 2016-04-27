import { Map, Record } from 'immutable';

export const ApiStatusState = Record({
  services: Map()
});

export const ApiStatusItem = Record({
  isLoading: false,
  success: null,
  status: null,     // only to be set on error
  statusText: null  // only to be set on error
});
