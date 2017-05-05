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

import { CurrentPlanState } from '../immutableRecords/currentPlan';
import PlansConstants from '../constants/PlansConstants';

const initialState = new CurrentPlanState();

export default function currentPlanReducer(state = initialState, action) {
  switch (action.type) {
    case PlansConstants.PLAN_CHOSEN:
      return state.set('currentPlanName', action.payload);

    case PlansConstants.PLAN_DETECTED:
      return state
        .set('currentPlanName', action.payload.currentPlanName)
        .set('conflict', action.payload.conflict);

    default:
      return state;
  }
}
