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

import { mockStore } from '../actions/utils';
import HeatApiService from '../../js/services/HeatApiService';

describe('HeatApiService', () => {
  const store = mockStore({});
  describe('.getStacks() (success)', () => {
    const apiResponse = {
      data: {
        stacks: [
          { stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' },
          { stack_name: 'anothercloud', stack_status: 'CREATE_FAILED' }
        ]
      }
    };

    beforeEach(() => {
      HeatApiService.defaultRequest = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(apiResponse));
    });

    it('returns a stack object based on <planName>', () =>
      store.dispatch(HeatApiService.getStacks()).then(result => {
        expect(HeatApiService.defaultRequest).toHaveBeenCalled();
        expect(result).toEqual({
          stacks: [
            { stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' },
            { stack_name: 'anothercloud', stack_status: 'CREATE_FAILED' }
          ]
        });
      }));
  });
});
