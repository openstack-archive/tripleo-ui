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

import { fromJS, List, Map } from 'immutable';

import { InitialPlanState, Plan, PlanFile } from '../immutableRecords/plans';
import PlansConstants from '../constants/PlansConstants';

const initialState = new InitialPlanState();

export default function plansReducer(state = initialState, action) {
  switch (action.type) {
    case PlansConstants.REQUEST_PLAN:
      return state;

    case PlansConstants.RECEIVE_PLAN: {
      let filesMap = fromJS(action.payload.planFiles).map(
        file => new PlanFile({ name: file.get('name') })
      );
      let newState = state.updateIn(
        ['all', action.payload.planName],
        new Plan({ name: action.payload.planName }),
        plan => plan.set('files', filesMap)
      );
      return newState;
    }

    case PlansConstants.REQUEST_PLANS:
      return state.set('isFetchingPlans', true);

    case PlansConstants.RECEIVE_PLANS: {
      return state
        .set('isFetchingPlans', false)
        .set('plansLoaded', true)
        .set(
          'all',
          Map(action.payload.map(plan => [plan.name, new Plan(plan)]))
        );
    }

    case PlansConstants.PLAN_CHOSEN:
      return state.set('currentPlanName', action.payload);

    case PlansConstants.DELETE_PLAN_PENDING: {
      return state.setIn(['all', action.payload, 'transition'], 'deleting');
    }

    case PlansConstants.DELETE_PLAN_SUCCESS: {
      return state.set('all', state.get('all').remove(action.payload));
    }

    case PlansConstants.DELETE_PLAN_FAILED: {
      return state.setIn(['all', action.payload, 'transition'], false);
    }

    case PlansConstants.CREATE_PLAN_PENDING:
      return state
        .set('isTransitioningPlan', true)
        .set('planFormErrors', List());

    case PlansConstants.CREATE_PLAN_SUCCESS:
      return state.set('isTransitioningPlan', false);

    case PlansConstants.CREATE_PLAN_FAILED:
      return state
        .set('isTransitioningPlan', false)
        .set('planFormErrors', List(action.payload));

    case PlansConstants.UPDATE_PLAN_PENDING:
      return state
        .setIn(['all', action.payload, 'transition'], 'updating')
        .set('isTransitioningPlan', true)
        .set('planFormErrors', List());

    case PlansConstants.UPDATE_PLAN_SUCCESS:
      return state
        .setIn(['all', action.payload, 'transition'], false)
        .set('isTransitioningPlan', false);

    case PlansConstants.UPDATE_PLAN_FAILED:
      return state
        .setIn(['all', action.payload.planName, 'transition'], false)
        .set('isTransitioningPlan', false)
        .set('planFormErrors', List(action.payload.errors));

    case PlansConstants.CANCEL_CREATE_PLAN:
      return state.set('planFormErrors', List());

    case PlansConstants.EXPORT_PLAN_PENDING: {
      return state.set('isExportingPlan', true);
    }

    case PlansConstants.EXPORT_PLAN_SUCCESS: {
      return state
        .set('isExportingPlan', false)
        .set('planExportUrl', action.payload);
    }

    case PlansConstants.EXPORT_PLAN_FAILED: {
      return state.set('isExportingPlan', false);
    }

    default:
      return state;
  }
}
