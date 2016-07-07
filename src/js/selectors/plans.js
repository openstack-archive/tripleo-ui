import { createSelector } from 'reselect';

const plansSelector = state => state.plans.get('all');
export const currentPlanNameSelector = state => state.currentPlan.get('currentPlanName');
export const getCurrentPlan = createSelector(
  plansSelector,
  currentPlanNameSelector,
  (plans, currentPlanName) => plans.find(plan => plan.name == currentPlanName)
);

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
