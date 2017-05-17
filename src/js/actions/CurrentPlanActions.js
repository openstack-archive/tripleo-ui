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

import { defineMessages } from 'react-intl';

import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import ValidationsActions from '../actions/ValidationsActions';

const messages = defineMessages({
  planActivatedNotificationTitle: {
    id: 'CurrentPlanActions.planActivatedNotificationTitle',
    defaultMessage: 'Plan Activated'
  },
  planActivatedNotificationMessage: {
    id: 'CurrentPlanActions.planActivatedNotificationMessage',
    defaultMessage: 'The plan {planName} was activated.'
  }
});

export default {
  detectPlan() {
    return (dispatch, getState) => {
      let state = getState();
      let plans = state.plans.all.map(plan => plan.get('name'));
      let conflict;
      let currentPlanName = state.currentPlan.get('currentPlanName');
      let previousPlan = currentPlanName || getStoredPlan();
      // No plans present.
      if (plans.size < 1) {
        if (!previousPlan) {
          currentPlanName = undefined;
        }
      } else if (!previousPlan) {
        // Plans present.
        // No previously chosen plan.
        currentPlanName = plans.first();
      } else if (!plans.includes(previousPlan)) {
        // Previously chosen plan doesn't exist any more.
        conflict = previousPlan;
        currentPlanName = plans.first();
      } else if (!currentPlanName && previousPlan) {
        // No plan in state, but in localStorage
        currentPlanName = previousPlan;
      }
      storePlan(currentPlanName);
      dispatch(this.planDetected(currentPlanName, conflict));
    };
  },

  planDetected(currentPlanName, conflict) {
    return {
      type: PlansConstants.PLAN_DETECTED,
      payload: {
        currentPlanName: currentPlanName,
        conflict: conflict
      }
    };
  },

  choosePlan(planName) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(
        NotificationActions.notify({
          title: formatMessage(messages.planActivatedNotificationTitle),
          message: formatMessage(messages.planActivatedNotificationMessage, {
            planName: planName
          }),
          type: 'success'
        })
      );
      storePlan(planName);
      dispatch(this.planChosen(planName));
      dispatch(
        ValidationsActions.runValidationGroups(
          ['prep', 'pre-deployment'],
          planName
        )
      );
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
    if (!name) {
      window.localStorage.removeItem('currentPlanName');
    } else {
      window.localStorage.setItem('currentPlanName', name);
    }
  }
}

function getStoredPlan() {
  if (window && window.localStorage) {
    return window.localStorage.getItem('currentPlanName');
  }
  return null;
}
