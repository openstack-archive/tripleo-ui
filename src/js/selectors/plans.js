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
import { List, Set } from 'immutable';

export const plans = state => state.plans.get('all').sortBy(plan => plan.name);

export const getPlan = (state, planName) =>
  state.plans.getIn(['all', planName]);

export const getPlanFiles = (state, planName) =>
  state.plans.getIn(['planFilesByPlan', planName], Set());

export const getPlanTransitionsByPlan = state =>
  state.plans.get('planTransitionsByPlan');

export const getPlanTransitions = (state, planName) =>
  state.plans.getIn(['planTransitionsByPlan', planName], List());

export const getPlanEnvironmentsByPlan = state =>
  state.plans.get('planEnvironmentsByPlan');

export const currentPlanName = state => state.plans.currentPlanName;

export const getCurrentPlan = createSelector(
  plans,
  currentPlanName,
  (plans, currentPlanName) => plans.get(currentPlanName)
);

export const getCurrentPlanName = createSelector(
  getCurrentPlan,
  currentPlan => currentPlan && currentPlan.name
);

export const getIsLoadingPlan = createSelector(
  getPlanTransitions,
  planTransitions =>
    planTransitions.filter(transition => transition === 'loading').size > 0
);

export const getPlans = createSelector(plans, plans => plans);
