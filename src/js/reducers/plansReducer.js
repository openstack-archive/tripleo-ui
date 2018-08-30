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

import { List, Map, Set } from 'immutable';

import {
  InitialPlanState,
  Plan,
  PlanEnvironment
} from '../immutableRecords/plans';
import PlansConstants from '../constants/PlansConstants';

const initialState = new InitialPlanState();

export default function plansReducer(state = initialState, action) {
  switch (action.type) {
    case PlansConstants.FETCH_PLANS_PENDING:
      return state.set('isFetchingPlans', true);

    case PlansConstants.FETCH_PLANS_SUCCESS: {
      return (
        state
          .set('isFetchingPlans', false)
          .set('plansLoaded', true)
          // TODO(jtomasek): this could get simplified to List of plan names
          .set(
            'all',
            Map(action.payload.map(plan => [plan, new Plan({ name: plan })]))
          )
      );
    }

    case PlansConstants.FETCH_PLAN_FILES_PENDING:
    case PlansConstants.FETCH_PLAN_DETAILS_PENDING:
      return state.updateIn(
        ['planTransitionsByPlan', action.payload],
        List(),
        addTransition('loading')
      );

    case PlansConstants.FETCH_PLAN_FILES_SUCCESS: {
      const { planName, planFiles } = action.payload;
      return state
        .setIn(
          ['planFilesByPlan', planName],
          Set(planFiles.map(planFile => planFile.name))
        )
        .updateIn(
          ['planTransitionsByPlan', planName],
          List(),
          removeTransition('loading')
        );
    }

    case PlansConstants.FETCH_PLAN_FILES_FAILED: {
      return state
        .setIn(['planFilesByPlan', action.payload], undefined)
        .updateIn(
          ['planTransitionsByPlan', action.payload],
          List(),
          removeTransition('loading')
        );
    }

    case PlansConstants.FETCH_PLAN_DETAILS_FAILED: {
      return state
        .setIn(['planEnvironmentsByPlan', action.payload], undefined)
        .updateIn(
          ['planTransitionsByPlan', action.payload],
          List(),
          removeTransition('loading')
        );
    }

    case PlansConstants.FETCH_PLAN_DETAILS_SUCCESS: {
      const { planName, planEnvironment } = action.payload;
      return state
        .setIn(
          ['planEnvironmentsByPlan', planName],
          new PlanEnvironment(planEnvironment)
        )
        .updateIn(
          ['planTransitionsByPlan', planName],
          List(),
          removeTransition('deleting')
        );
    }

    case PlansConstants.FETCH_PLAN_DETAILS_FAILED: {
      return state
        .setIn(['planEnvironmentsByPlan', action.payload], undefined)
        .updateIn(
          ['planTransitionsByPlan', action.payload],
          List(),
          removeTransition('loading')
        );
    }

    case PlansConstants.PLAN_CHOSEN:
      return state.set('currentPlanName', action.payload);

    case PlansConstants.DELETE_PLAN_PENDING: {
      return state.updateIn(
        ['planTransitionsByPlan', action.payload],
        List(),
        addTransition('deleting')
      );
    }

    case PlansConstants.DELETE_PLAN_SUCCESS: {
      return state
        .update('all', plans => plans.remove(action.payload))
        .updateIn(
          ['planTransitionsByPlan', action.payload],
          List(),
          removeTransition('deleting')
        );
    }

    case PlansConstants.DELETE_PLAN_FAILED: {
      return state.updateIn(
        ['planTransitionsByPlan', action.payload],
        List(),
        removeTransition('deleting')
      );
    }

    case PlansConstants.CREATE_PLAN_SUCCESS:
      return state.setIn(
        ['all', action.payload],
        new Plan({ name: action.payload })
      );

    case PlansConstants.UPDATE_PLAN_PENDING:
      return state.updateIn(
        ['planTransitionsByPlan', action.payload],
        List(),
        addTransition('updating')
      );

    case PlansConstants.UPDATE_PLAN_SUCCESS:
    case PlansConstants.UPDATE_PLAN_FAILED:
      return state.updateIn(
        ['planTransitionsByPlan', action.payload],
        List(),
        removeTransition('updating')
      );

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

/**
 * Helper function to remove transition from plan transitions
 * @param {Immutable List} transitions
 * @param {string} remove - a transition to remove
 */
export const removeTransition = remove => transitions =>
  transitions.delete(transitions.findIndex(value => value === remove));

/**
 * Helper function to add transition to plan transitions
 * @param {Immutable List} transitions
 * @param {string} add - a transition to add
 */
export const addTransition = add => transitions => transitions.unshift(add);
