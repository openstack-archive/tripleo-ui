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

import PlansConstants from '../constants/PlansConstants';
import ValidationsActions from '../actions/ValidationsActions';
import { getPlans, getCurrentPlanName } from '../selectors/plans';

export default {
  choosePlan(newPlanName) {
    return (dispatch, getState) => {
      const currentPlanName = getCurrentPlanName(getState());
      const plans = getPlans(getState());

      if (plans.get(newPlanName)) {
        if (newPlanName !== currentPlanName) {
          storePlan(newPlanName);
          dispatch(this.planChosen(newPlanName));
          dispatch(
            ValidationsActions.runValidationGroups(
              ['prep', 'pre-deployment'],
              newPlanName
            )
          );
        }
      } else {
        storePlan();
        dispatch(this.planChosen());
      }
    };
  },

  planChosen(planName) {
    return {
      type: PlansConstants.PLAN_CHOSEN,
      payload: planName
    };
  }
};

function storePlan(name) {
  if (window && window.localStorage) {
    if (name) {
      window.localStorage.setItem('currentPlanName', name);
    } else {
      window.localStorage.removeItem('currentPlanName');
    }
  }
}
