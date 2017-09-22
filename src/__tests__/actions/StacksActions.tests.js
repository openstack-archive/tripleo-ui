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

import { mockStore } from './utils';
import * as ErrorActions from '../../js/actions/ErrorActions';
import HeatApiService from '../../js/services/HeatApiService';
import StacksActions from '../../js/actions/StacksActions';

describe('StacksActions', () => {
  describe('fetchStacks (success)', () => {
    const store = mockStore({});
    const serviceResponse = {
      stacks: [{ stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }]
    };
    const normalizedStacks = {
      overcloud: { stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }
    };

    beforeEach(() => {
      HeatApiService.getStacks = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(serviceResponse));
    });

    it('dispatches actions', () => {
      return store.dispatch(StacksActions.fetchStacks()).then(() => {
        expect(HeatApiService.getStacks).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          StacksActions.fetchStacksPending(),
          StacksActions.fetchStacksSuccess(normalizedStacks)
        ]);
      });
    });
  });

  describe('fetchStacks (failed)', () => {
    const store = mockStore({});

    beforeEach(() => {
      HeatApiService.getStacks = jest
        .fn()
        .mockReturnValue(() => Promise.reject());
      ErrorActions.handleErrors = jest.fn().mockReturnValue(() => {});
    });

    it('dispatches actions', () => {
      return store.dispatch(StacksActions.fetchStacks()).then(() => {
        expect(HeatApiService.getStacks).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          StacksActions.fetchStacksPending(),
          StacksActions.fetchStacksFailed()
        ]);
      });
    });
  });

  // describe('fetchStacks (failed)', () => {
  //   beforeEach(done => {
  //     spyOn(HeatApiService, 'getStacks').and.callFake(
  //       createRejectingPromise('failed')
  //     );
  //     spyOn(StacksActions, 'fetchStacksPending');
  //     spyOn(StacksActions, 'fetchStacksSuccess');
  //     spyOn(StacksActions, 'fetchStacksFailed');
  //     StacksActions.fetchStacks()(() => {}, () => {});
  //     setTimeout(() => {
  //       done();
  //     }, 1);
  //   });

  //   it('dispatches fetchStacksPending', () => {
  //     expect(StacksActions.fetchStacksPending).toHaveBeenCalled();
  //   });

  //   it('does not dispatch fetchStacksSuccess', () => {
  //     expect(StacksActions.fetchStacksSuccess).not.toHaveBeenCalled();
  //   });

  //   it('dispatches fetchStacksFailed', () => {
  //     expect(StacksActions.fetchStacksFailed).toHaveBeenCalled();
  //   });
  // });
});
