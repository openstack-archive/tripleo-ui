import { Map, Record } from 'immutable';

/**
 * The transition property is either false or one of the following strings:
 *   - `deleting`
 *   - `updating`
 */
export const Plan = Record({
  name: '',
  transition: false,
  files: Map()
});

export const PlanFile = Record({
  name: '',
  contents: '',
  info: Map()
});

export const Stack = Record({
  stack_name: '',
  stack_status: ''
});

export const InitialPlanState = Record({
  isFetchingPlans: false,
  isFetchingStacks: false,
  conflict: undefined,
  currentPlanName: undefined,
  stacks: Map(),
  all: Map()
});
