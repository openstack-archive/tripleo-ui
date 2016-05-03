import { createSelector } from 'reselect';

import { Stack } from '../immutableRecords/stacks';
import { currentPlanNameSelector } from './plans';

// const plansSelector = state => state.plans.get('all');
const stacksSelector = state => state.stacks.get('stacks');

/**
 * Returns the stack associated with currentPlanName
 */
export const getCurrentStack = createSelector(
  [stacksSelector, currentPlanNameSelector],
  (stacks, currentPlanName) => stacks.get(currentPlanName)
);

/**
 * Returns a flag for the deployment progress of the current plan
 * (true if the plan is currently being deployed, false it not).
 */
export const getCurrentStackDeploymentProgress = createSelector(
  [stacksSelector, currentPlanNameSelector],
  (stacks, currentPlanName) => {
    return stacks.get(currentPlanName, Stack({})).stack_status === 'CREATE_IN_PROGRESS';
  }
);
