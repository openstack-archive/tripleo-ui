import { List, Map } from 'immutable';

import { InitialPlanState, Plan, PlanFile } from '../../js/immutableRecords/plans';
import PlansActions from '../../js/actions/PlansActions';
import plansReducer from '../../js/reducers/plansReducer';


describe('plansReducer state', () => {

  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(undefined, {type: 'undefined-action'});
    });

    it('`isFetchingPlans` is false', () => {
      expect(state.get('isFetchingPlans')).toBe(false);
    });

    it('`all` is empty', () => {
      expect(state.get('all').size).toEqual(0);
    });
  });

  describe('CREATE_PLAN_PENDING', () => {
    it('sets isTransitioningPlan to `true`', () => {
      let state = plansReducer(new InitialPlanState, PlansActions.createPlanPending());
      expect(state.isTransitioningPlan).toBe(true);
    });
  });

  describe('CREATE_PLAN_SUCCESS', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        new InitialPlanState({ isTransitioningPlan: true }),
        PlansActions.createPlanSuccess()
      );
    });

    it('sets isTransitioningPlan to `false`', () => {
      expect(state.isTransitioningPlan).toBe(false);
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
          'overcloud',
          'another-cloud'
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
            'some-cloud': new Plan({name: 'some-cloud' }),
            'overcloud': new Plan({name: 'overcloud' })
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
      expect(plan.get('files')).toEqual(Map({
        'capabilities_map.yaml': new PlanFile({ name: 'capabilities_map.yaml' }),
        'foo.yaml': new PlanFile({ name: 'foo.yaml' })
      }));
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
      expect(newState.get('all')).toEqual(Map({
        overcloud: new Plan({ name: 'overcloud' })
      }));
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
