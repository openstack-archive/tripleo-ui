import matchers from 'jasmine-immutable-matchers';
import { List, Map } from 'immutable';

import { InitialPlanState, Plan } from '../../js/immutableRecords/plans';
import PlansActions from '../../js/actions/PlansActions';
import plansReducer from '../../js/reducers/plansReducer';


describe('plansReducer state', () => {

  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

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
    let state;

    beforeEach(() => {
      state = plansReducer(new InitialPlanState, PlansActions.createPlanPending());
    });

    it('sets isCreatingPlan to `true`', () => {
      expect(state.isCreatingPlan).toBe(true);
    });
  });

  describe('CREATE_PLAN_SUCCESS', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        new InitialPlanState({ isCreatingPlan: true }),
        PlansActions.createPlanSuccess()
      );
    });

    it('sets isCreatingPlan to `false`', () => {
      expect(state.isCreatingPlan).toBe(false);
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
        PlansActions.receivePlan({
          name: 'overcloud',
          files: {
            'capabilities_map.yaml': {
              contents: 'foo',
              meta: { 'file-type': 'capabilities-map' }
            },
            'foo.yaml': {
              contents: 'bar'
            }
          }
        })
      );
      plan = state.getIn(['all', 'overcloud']);
    });

    it('updates the plan records `files` attributes', () => {
      expect(plan.get('files').size).toEqual(2);
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
      expect(newState.get('all')).toEqualImmutable(Map({
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
