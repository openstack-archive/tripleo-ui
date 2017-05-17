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

import { List, Map, Record } from 'immutable';

/**
 * The transition property is either false or one of the following strings:
 *   - `deleting`
 *   - `updating`
 */
export const Plan = Record({
  name: '',
  transition: false,
  files: Map(),
  isRequestingPlanDeploy: false
});

export const PlanFile = Record({
  name: '',
  info: Map()
});

export const InitialPlanState = Record({
  isFetchingPlans: false,
  plansLoaded: false,
  isTransitioningPlan: false,
  planFormErrors: List(),
  all: Map(),
  isExportingPlan: false,
  planExportUrl: ''
});
