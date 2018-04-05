/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { getCurrentPlanName } from './plans';

const stacksSelector = state => state.stacks.stacks;
const currentStackEnvironmentSelector = state =>
  state.stacks.currentStackEnvironment;
const stackResourcesSelector = state => state.stacks.resources;
const stackResourceDetailsSelector = state => state.stacks.resourceDetails;

/**
 * Returns the stack associated with currentPlanName
 */
export const getCurrentStack = createSelector(
  [stacksSelector, getCurrentPlanName],
  (stacks, currentPlanName) => stacks.get(currentPlanName)
);

/**
 * Returns calculated percentage of deployment progress
 */
export const getCurrentStackDeploymentProgress = createSelector(
  [stackResourcesSelector],
  resources => {
    let allResources = resources.size;
    if (allResources > 0) {
      let completeResources = resources.filter(
        r => r.resource_status === 'CREATE_COMPLETE'
      ).size;
      return Math.ceil(completeResources / allResources * 100);
    }
    return 0;
  }
);

/**
 * Returns a Map containing the overcloud information.
 */
export const getOvercloudInfo = createSelector(
  [
    currentStackEnvironmentSelector,
    getCurrentPlanName,
    stackResourceDetailsSelector
  ],
  (currentStackEnvironment, currentPlanName, stackResourceDetails) => {
    const adminPassword = currentStackEnvironment.getIn([
      'parameter_defaults',
      'AdminPassword'
    ]);
    const ipAddress = stackResourceDetails.getIn([
      'PublicVirtualIP',
      'attributes',
      'ip_address'
    ]);
    return Map({ ipAddress, adminPassword });
  }
);
