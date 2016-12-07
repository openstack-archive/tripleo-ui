import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { Stack } from '../immutableRecords/stacks';
import { currentPlanNameSelector } from './plans';

const stacksSelector = state => state.stacks.stacks;
const stackResourcesSelector = state => state.stacks.resources;

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
export const getCurrentStackDeploymentInProgress = createSelector(
  [stacksSelector, currentPlanNameSelector],
  (stacks, currentPlanName) => {
    return stacks.get(currentPlanName, new Stack()).stack_status === 'CREATE_IN_PROGRESS';
  }
);

/**
 * Returns calculated percentage of deployment progress
 */
export const getCurrentStackDeploymentProgress = createSelector(
  [stackResourcesSelector], (resources) => {
    let allResources = resources.size;
    if(allResources > 0) {
      let completeResources = resources.filter(r => {
        return r.resource_status === 'CREATE_COMPLETE';
      }).size;
      return Math.ceil(completeResources / allResources * 100);
    }
    return 0;
  }
);

export const getOvercloudInfo = createSelector(
  [getCurrentStack, stackResourcesSelector],
  (currentStack, stackResources) => {
    const adminPassword = currentStack ? currentStack.getIn(
      ['environment', 'parameter_defaults', 'AdminPassword']
    ) : null;
    const ipAddress = stackResources ? stackResources.getIn(
      ['PublicVirtualIP', 'attributes', 'ip_address']) : null;
    if(adminPassword && ipAddress) {
      return Map({
        ipAddress: ipAddress,
        adminPassword: adminPassword
      });
    }
    return false;
  }
);
