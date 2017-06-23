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

const plansSelector = state => state.plans.get('all').sortBy(plan => plan.name);

export const currentPlanNameSelector = state =>
  state.currentPlan.get('currentPlanName');
export const getCurrentPlan = createSelector(
  plansSelector,
  currentPlanNameSelector,
  (plans, currentPlanName) => plans.get(currentPlanName)
);

/**
 * Returns a Map o all plans except for the selected one
 */
// TODO(jtomasek): update this to list 3 last used plans
export const getAllPlansButCurrent = createSelector(
  [plansSelector, currentPlanNameSelector],
  (plans, currentPlanName) => {
    return plans
      .filter(plan => plan.name != currentPlanName)
      .sortBy(plan => plan.name);
  }
);
