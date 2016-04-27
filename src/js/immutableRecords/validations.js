import { List, Map, Record } from 'immutable';

export const ValidationStage = Record({
  description: '',
  name: '',
  visible: false,
  stage: '',
  status: '',
  uuid: '',
  validations: List()
});

export const Validation = Record({
  description: '',
  latest_result: undefined,
  name: '',
  status: '',
  results: List(),
  uuid: ''
});

export const ValidationResult = Record({
  date: undefined,
  detailed_description: Map(),
  status: undefined,
  uuid: ''
});

export const ValidationsStatusCounts = Record({
  new: 0,
  running: 0,
  success: 0,
  error: 0,
  failed: 0
});
