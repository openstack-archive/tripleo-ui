import { createSelector } from 'reselect';

const plansSelector = state => state.plans.get('all');
const stacksSelector = state => state.plans.get('stacks');
const currentPlanNameSelector = state => state.plans.get('currentPlanName');

/**
 * Returns a Map o all plans except for the selected one
 */
// TODO(jtomasek): update this to list 3 last used plans
export const getAllPlansButCurrent = createSelector(
  [plansSelector, currentPlanNameSelector], (plans, currentPlanName) => {
    return plans.filter(plan => plan.name != currentPlanName)
                .sortBy(plan => plan.name);
  }
);

/**
 * Returns the stack associated with currentPlanName
 */
export const getCurrentStack = createSelector(
  [stacksSelector, currentPlanNameSelector],
  (stacks, currentPlanName) => stacks.get(currentPlanName)
);
