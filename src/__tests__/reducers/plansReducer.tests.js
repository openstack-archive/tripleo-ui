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

import { List, Map } from 'immutable';

import CurrentPlanActions from '../../js/actions/CurrentPlanActions';
import {
  InitialPlanState,
  Plan,
  PlanFile
} from '../../js/immutableRecords/plans';
import PlansActions from '../../js/actions/PlansActions';
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

  describe('REQUEST_PLANSLIST', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        Map({ isFetchingPlans: false }),
        PlansActions.requestPlans()
      );
    });

    it('sets `isFetchingPlans` to true', () => {
      expect(state.get('isFetchingPlans')).toBe(true);
    });
  });

  describe('RECEIVE_PLANSLIST', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        Map({
          isFetchingPlans: true,
          all: List()
        }),
        PlansActions.receivePlans([
          { name: 'overcloud', description: 'Default deployment plan' },
          { name: 'another-cloud', description: 'My custom plan' }
        ])
      );
    });

    it('sets `isFetchingPlans` to false', () => {
      expect(state.get('isFetchingPlans')).toBe(false);
    });

    it('sets `all` to a list of Plan records', () => {
      expect(state.get('all').size).toEqual(2);
      state.get('all').forEach(item => {
        expect(item instanceof Plan).toBe(true);
      });
    });
  });

  describe('RECEIVE_PLAN', () => {
    let state, plan;

    beforeEach(() => {
      state = plansReducer(
        Map({
          all: Map({
            'some-cloud': new Plan({
              name: 'some-cloud',
              description: 'some cloud desc'
            }),
            overcloud: new Plan({
              name: 'overcloud',
              description: 'Default deployment plan'
            })
          })
        }),
        PlansActions.receivePlan('overcloud', {
          'capabilities_map.yaml': { name: 'capabilities_map.yaml' },
          'foo.yaml': { name: 'foo.yaml' }
        })
      );
      plan = state.getIn(['all', 'overcloud']);
    });

    it('updates the plan records `files` attributes', () => {
      expect(plan.get('files')).toEqual(
        Map({
          'capabilities_map.yaml': new PlanFile({
            name: 'capabilities_map.yaml'
          }),
          'foo.yaml': new PlanFile({ name: 'foo.yaml' })
        })
      );
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
    let state = Map({
      all: Map({
        overcloud: new Plan({ name: 'overcloud' }),
        somecloud: new Plan({ name: 'somecloud' })
      })
    });
    let newState;

    it('DELETE_PLAN_PENDING sets `transition` in plan Record to `deleting`', () => {
      newState = plansReducer(
        state,
        PlansActions.deletePlanPending('somecloud')
      );
      let plan = newState.getIn(['all', 'somecloud']);
      expect(plan.get('transition')).toBe('deleting');
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
    });

    it('DELETE_PLAN_FAILED sets `transition` in plan Record to false', () => {
      newState = plansReducer(
        newState,
        PlansActions.deletePlanFailed('somecloud')
      );
      let plan = newState.getIn(['all', 'somecloud']);
      expect(plan.get('transition')).toBe(false);
    });
  });
});
