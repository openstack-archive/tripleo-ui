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

export const plans = state => state.plans.get('all').sortBy(plan => plan.name);
export const currentPlanName = state => state.currentPlan.currentPlanName;

export const getCurrentPlan = createSelector(
  plans,
  currentPlanName,
  (plans, currentPlanName) => plans.get(currentPlanName)
);

export const getCurrentPlanName = createSelector(
  getCurrentPlan,
  currentPlan => currentPlan && currentPlan.name
);

export const getPlans = createSelector(plans, plans => plans);

/**
 * Returns a Map o all plans except for the selected one
 */
// TODO(jtomasek): update this to list 3 last used plans
export const getAllPlansButCurrent = createSelector(
  [plans, getCurrentPlanName],
  (plans, currentPlanName) => {
    return plans
      .filter(plan => plan.name != currentPlanName)
      .sortBy(plan => plan.name);
  }
);
