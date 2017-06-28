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

import { fromJS, Map, OrderedMap } from 'immutable';

// TODO(jtomasek): remove this import when store is correctly mocked
import store from '../../js/store'; // eslint-disable-line no-unused-vars

import { StacksState, Stack } from '../../js/immutableRecords/stacks';
import StacksActions from '../../js/actions/StacksActions';
import stacksReducer from '../../js/reducers/stacksReducer';

describe('stacksReducer state', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = stacksReducer(undefined, { type: 'undefined-action' });
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

    it('`stacks` is empty', () => {
      expect(state.get('isFetchingEnvironment')).toBe(false);
    });
  });

  describe('Stack status', () => {
    describe('fetchStacksPending', () => {
      it('sets isFetching to true', () => {
        expect(
          stacksReducer(undefined, StacksActions.fetchStacksPending())
            .isFetching
        ).toBe(true);
      });
    });

    describe('fetchStacksSuccess', () => {
      let state;

      beforeEach(() => {
        state = stacksReducer(
          new StacksState({ isFetching: true }),
          StacksActions.fetchStacksSuccess({
            overcloud: {
              stack_name: 'overcloud',
              stack_status: 'CREATE_COMPLETE'
            }
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
        expect(state.stacks).toEqual(
          Map({
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
          })
        );
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

    describe('fetchEnvironmentPending', () => {
      let state;

      beforeEach(() => {
        state = stacksReducer(
          new StacksState({ isFetchingEnvironment: false }),
          StacksActions.fetchEnvironmentPending()
        );
      });

      it('sets isFetchingEnvironment to true', () => {
        expect(state.isFetchingEnvironment).toBe(true);
      });
    });

    describe('fetchEnvironmentFailed', () => {
      let state;

      beforeEach(() => {
        state = stacksReducer(
          new StacksState({ isFetchingEnvironment: true }),
          StacksActions.fetchEnvironmentFailed()
        );
      });

      it('sets isFetchingEnvironment to false', () => {
        expect(state.isFetchingEnvironment).toBe(false);
      });
    });

    describe('fetchEnvironmentSuccess', () => {
      let state;

      beforeEach(() => {
        state = stacksReducer(
          new StacksState({
            isFetchingEnvironment: true,
            currentStackEnvironment: Map(),
            stacks: Map({
              overcloud: Stack(),
              foocloud: Stack()
            })
          }),
          StacksActions.fetchEnvironmentSuccess(
            { stack_name: 'overcloud' },
            { parameter_defaults: { AdminPassword: '12345' } }
          )
        );
      });

      it('sets the environment for the correct stack', () => {
        expect(state.get('currentStackEnvironment')).toEqual(
          fromJS({
            parameter_defaults: { AdminPassword: '12345' }
          })
        );
      });

      it('sets isFetchingEnvironment to false', () => {
        expect(state.isFetchingEnvironment).toBe(false);
      });
    });
  });
});
