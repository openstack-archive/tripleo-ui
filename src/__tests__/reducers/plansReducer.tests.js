import matchers from 'jasmine-immutable-matchers';
import { normalize, arrayOf } from 'normalizr';
import { List, Map } from 'immutable';

import { InitialPlanState, Stack } from '../../js/immutableRecords/plans';
import { Plan } from '../../js/immutableRecords/plans';
import PlansActions from '../../js/actions/PlansActions';
import plansReducer from '../../js/reducers/plansReducer';
import { planSchema } from '../../js/normalizrSchemas/plans';


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

    it('`conflict` is undefined', () => {
      expect(state.get('conflict')).not.toBeDefined();
    });

    it('`currentPlanName` is undefined', () => {
      expect(state.get('currentPlanName')).not.toBeDefined();
    });

    it('`all` is empty', () => {
      expect(state.get('all').size).toEqual(0);
    });
  });

  describe('PLAN_CHOSEN', () => {
    let state;

    beforeEach(() => {
      state = plansReducer(
        Map({
          currentPlanName: undefined,
          all: List.of(...['overcloud', 'another-cloud'])
        }),
        PlansActions.planChosen('another-cloud')
      );
    });

    it('sets the current planName', () => {
      expect(state.get('currentPlanName')).toEqual('another-cloud');
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
        PlansActions.receivePlans(normalize([
          { name: 'overcloud' },
          { name: 'another-cloud' }
        ], arrayOf(planSchema)))
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

    it('DELETING_PLAN sets `transition` in plan Record to `deleting`', () => {
      newState = plansReducer(
        state,
        PlansActions.deletingPlan('somecloud')
      );
      let plan = newState.getIn(['all', 'somecloud']);
      expect(plan.get('transition')).toBe('deleting');
    });

    it('PLAN_DELETED sets `transition` in plan Record to false', () => {
      newState = plansReducer(
        newState,
        PlansActions.planDeleted('somecloud')
      );
      let plan = newState.getIn(['all', 'somecloud']);
      expect(plan.get('transition')).toBe(false);
    });
  });

  describe('Stack status', () => {
    describe('fetchStacksPending', () => {
      it('sets isFetchingStacks to true', () => {
        expect(plansReducer(undefined, PlansActions.fetchStacksPending()).isFetchingStacks)
          .toBe(true);
      });
    });

    describe('fetchStacksSuccess', () => {
      let state;

      beforeEach(() => {
        state = plansReducer(
          new InitialPlanState({ isFetchingStacks: true }),
          PlansActions.fetchStacksSuccess([
            { stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }
          ])
        );
      });

      it('sets isFetchingStacks to false', () => {
        expect(state.isFetchingStacks).toBe(false);
      });

      it('sets stacks in state', () => {
        expect(state.stacks).toEqualImmutable(Map({
          overcloud: new Stack({
            stack_name: 'overcloud',
            stack_status: 'CREATE_COMPLETE'
          })
        }));
      });
    });

    describe('fetchStacksFailed', () => {
      let state;

      beforeEach(() => {
        state = plansReducer(
          new InitialPlanState({ isFetchingStacks: true }),
          PlansActions.fetchStacksFailed()
        );
      });

      it('sets isFetchingStacks to false', () => {
        expect(state.isFetchingStacks).toBe(false);
      });

      it('sets stacks in state to an empty Map', () => {
        expect(state.stacks).toEqualImmutable(Map());
      });
    });
  });
});
