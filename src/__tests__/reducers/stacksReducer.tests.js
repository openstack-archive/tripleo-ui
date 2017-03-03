import { Map, OrderedMap } from 'immutable';

import { StacksState, Stack } from '../../js/immutableRecords/stacks';
import StacksActions from '../../js/actions/StacksActions';
import stacksReducer from '../../js/reducers/stacksReducer';


describe('stacksReducer state', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = stacksReducer(undefined, {type: 'undefined-action'});
    });

    it('`isFetching` is false', () => {
      expect(state.isFetching).toBe(false);
    });

    it('`isLoaded` is false', () => {
      expect(state.get('isLoaded')).toBe(false);
    });

    it('`stacks` is empty', () => {
      expect(state.get('stacks').size).toEqual(0);
    });
  });

  describe('Stack status', () => {
    describe('fetchStacksPending', () => {
      it('sets isFetching to true', () => {
        expect(stacksReducer(undefined, StacksActions.fetchStacksPending()).isFetching)
          .toBe(true);
      });
    });

    describe('fetchStacksSuccess', () => {
      let state;

      beforeEach(() => {
        state = stacksReducer(
          new StacksState({ isFetching: true }),
          StacksActions.fetchStacksSuccess({
            overcloud: { stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }
          })
        );
      });

      it('sets isLoaded to true', () => {
        expect(state.isFetching).toBe(false);
      });

      it('sets isFetching to false', () => {
        expect(state.isFetching).toBe(false);
      });

      it('sets stacks in state', () => {
        expect(state.stacks).toEqual(Map({
          overcloud: new Stack({
            creation_time: undefined,
            deletion_time: undefined,
            description: undefined,
            id: undefined,
            parent: undefined,
            resources: OrderedMap(),
            stack_name: 'overcloud',
            stack_owner: undefined,
            stack_status: 'CREATE_COMPLETE',
            stack_status_reason: undefined,
            stack_user_project_id: undefined,
            tags: Map(),
            updated_time: undefined
          })
        }));
      });
    });

    describe('fetchStacksFailed', () => {
      let state;

      beforeEach(() => {
        state = stacksReducer(
          new StacksState({ isFetching: true }),
          StacksActions.fetchStacksFailed()
        );
      });

      it('sets isFetching to false', () => {
        expect(state.isFetching).toBe(false);
      });

      it('sets stacks in state to an empty Map', () => {
        expect(state.stacks).toEqual(Map());
      });
    });
  });
});
