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

export const InitialPlanState = Record({
  isFetchingPlans: false,
  isCreatingPlan: false,
  all: Map()
});
