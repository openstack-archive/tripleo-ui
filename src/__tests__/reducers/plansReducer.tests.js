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

import { Set, List, Map } from 'immutable';

import CurrentPlanActions from '../../js/actions/CurrentPlanActions';
import {
  InitialPlanState,
  Plan,
  PlanEnvironment
} from '../../js/immutableRecords/plans';
import * as PlansActions from '../../js/actions/PlansActions';
import plansReducer from '../../js/reducers/plansReducer';

describe('plansReducer state', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(undefined, { type: 'undefined-action' });
    });

    it('`isFetchingPlans` is false', () => {
      expect(state.get('isFetchingPlans')).toBe(false);
    });

    it('`all` is empty', () => {
      expect(state.get('all').size).toEqual(0);
    });

    it('`currentPlanName` is undefined', () => {
      expect(state.get('currentPlanName')).not.toBeDefined();
    });
  });

  describe('FETCH_PLANS_PENDING', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        Map({ isFetchingPlans: false }),
        PlansActions.fetchPlansPending()
      );
    });

    it('sets `isFetchingPlans` to true', () => {
      expect(state.get('isFetchingPlans')).toBe(true);
    });
  });

  describe('FETCH_PLANS_SUCCESS', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        Map({
          isFetchingPlans: true,
          all: Map()
        }),
        PlansActions.fetchPlansSuccess(['overcloud', 'another-cloud'])
      );
    });

    it('sets `isFetchingPlans` to false', () => {
      expect(state.get('isFetchingPlans')).toBe(false);
    });

    it('sets `all` to a Map of Plan records', () => {
      expect(state.get('all').size).toEqual(2);
      state.get('all').forEach(item => {
        expect(item instanceof Plan).toBe(true);
      });
    });
  });

  describe('FETCH_PLAN_FILES_PENDING', () => {
    it('adds the transition', () => {
      const state = new InitialPlanState();
      const newState = plansReducer(
        state,
        PlansActions.fetchPlanFilesPending('overcloud')
      );

      expect(newState.getIn(['planTransitionsByPlan', 'overcloud'])).toEqual(
        List(['loading'])
      );
    });
  });

  describe('FETCH_PLAN_FILES_SUCCESS', () => {
    let planFiles, plan, state, newState;

    beforeEach(() => {
      planFiles = [{ name: 'capabilities-map.yaml' }, { name: 'foo.yaml' }];
      plan = 'overcloud';
      state = new InitialPlanState({
        all: Map({ overcloud: new Plan({ name: 'overcloud' }) }),
        planTransitionsByPlan: Map({ overcloud: List(['loading']) })
      });
      newState = plansReducer(
        state,
        PlansActions.fetchPlanFilesSuccess(plan, planFiles)
      );
    });

    it('stops the loading transition', () => {
      expect(newState.getIn(['planTransitionsByPlan', plan])).toEqual(List());
    });

    it('sets planFilesByPlan', () => {
      const expectedPlanFiles = Set(['capabilities-map.yaml', 'foo.yaml']);
      expect(newState.getIn(['planFilesByPlan', plan])).toEqual(
        expectedPlanFiles
      );
    });
  });

  describe('FETCH_PLAN_FILES_FAILED', () => {
    const plan = 'overcloud';
    const state = new InitialPlanState({
      planTransitionsByPlan: Map({ [plan]: List(['loading']) })
    });
    const newState = plansReducer(
      state,
      PlansActions.fetchPlanFilesFailed(plan)
    );

    it('stops the loading transition', () => {
      expect(newState.getIn(['planTransitionsByPlan', plan])).toEqual(List());
    });
  });

  describe('FETCH_PLAN_DETAILS_PENDING', () => {
    it('adds the transition', () => {
      const state = new InitialPlanState();
      const newState = plansReducer(
        state,
        PlansActions.fetchPlanDetailsPending('overcloud')
      );

      expect(newState.getIn(['planTransitionsByPlan', 'overcloud'])).toEqual(
        List(['loading'])
      );
    });
  });

  describe('FETCH_PLAN_DETAILS_SUCCESS', () => {
    let planEnvironment, plan, state, newState;

    beforeEach(() => {
      planEnvironment = { description: 'Description' };
      plan = 'overcloud';
      state = new InitialPlanState({
        all: Map({ overcloud: new Plan({ name: 'overcloud' }) }),
        planTransitionsByPlan: Map({ overcloud: List(['loading']) })
      });
      newState = plansReducer(
        state,
        PlansActions.fetchPlanDetailsSuccess(plan, planEnvironment)
      );
    });

    it('stops the loading transition', () => {
      expect(newState.getIn(['planTransitionsByPlan', plan])).toEqual(List());
    });

    it('sets planEnvironmentsByPlan', () => {
      const expectedPlanEnvironment = new PlanEnvironment(planEnvironment);
      expect(newState.getIn(['planEnvironmentsByPlan', plan])).toEqual(
        expectedPlanEnvironment
      );
    });
  });

  describe('FETCH_PLAN_DETAILS_FAILED', () => {
    const plan = 'overcloud';
    const state = new InitialPlanState({
      planTransitionsByPlan: Map({ [plan]: List(['loading']) })
    });
    const newState = plansReducer(
      state,
      PlansActions.fetchPlanDetailsFailed(plan)
    );

    it('stops the loading transition', () => {
      expect(newState.getIn(['planTransitionsByPlan', plan])).toEqual(List());
    });
  });

  describe('PLAN_CHOSEN', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        new InitialPlanState(),
        CurrentPlanActions.planChosen('another-cloud')
      );
    });

    it('sets the current planName', () => {
      expect(state.get('currentPlanName')).toEqual('another-cloud');
    });
  });

  describe('Plan deletion', () => {
    let state = new InitialPlanState({
      all: Map({
        overcloud: new Plan({ name: 'overcloud' }),
        somecloud: new Plan({ name: 'somecloud' })
      })
    });
    let newState;

    it('DELETE_PLAN_PENDING sets adds `deleting` transition', () => {
      newState = plansReducer(
        state,
        PlansActions.deletePlanPending('somecloud')
      );
      expect(newState.getIn(['planTransitionsByPlan', 'somecloud'])).toEqual(
        List(['deleting'])
      );
    });

    it('DELETE_PLAN_SUCCESS removes the plan Record', () => {
      newState = plansReducer(
        newState,
        PlansActions.deletePlanSuccess('somecloud')
      );
      expect(newState.get('all')).toEqual(
        Map({
          overcloud: new Plan({ name: 'overcloud' })
        })
      );
      expect(newState.getIn(['planTransitionsByPlan', 'somecloud'])).toEqual(
        List()
      );
    });

    it('DELETE_PLAN_FAILED sets `transition` in plan Record to false', () => {
      newState = plansReducer(
        newState,
        PlansActions.deletePlanFailed('somecloud')
      );
      expect(newState.getIn(['planTransitionsByPlan', 'somecloud'])).toEqual(
        List()
      );
    });
  });
});
