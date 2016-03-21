import { createSelector } from 'reselect';

const plans = state => state.plans.get('all');
const currentPlanName = state => state.plans.get('currentPlanName');

/**
 * Returns a Map o all plans except for the selected one
 */
// TODO(jtomasek): update this to list 3 last used plans
export const getAllPlansButCurrent = createSelector(
  [plans, currentPlanName], (plans, currentPlanName) => {
    return plans.filter(plan => plan.name != currentPlanName)
                .sortBy(plan => plan.name);
  }
);
