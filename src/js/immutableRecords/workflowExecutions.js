import { Map, Record } from 'immutable';

export const WorkflowExecution = Record({
  description: undefined,
  id: undefined,
  input: Map(),
  output: Map(),
  params: Map(),
  state: undefined,
  state_info: undefined,
  updated_at: Date.now(),
  workflow_name: undefined
});
