/**
 * Copyright 2018 Red Hat Inc.
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

import FlavorsActions from '../../js/actions/FlavorsActions';
import FlavorsConstants from '../../js/constants/FlavorsConstants';
import NovaApiService from '../../js/services/NovaApiService';
import { mockStore } from './utils';

describe('Flavors Actions', () => {
  beforeEach(() => {
    NovaApiService.getFlavors = jest.fn().mockReturnValue(() =>
      Promise.resolve({
        flavors: [{ id: 'abc', name: 'flavor' }]
      })
    );

    NovaApiService.getFlavorProfile = jest.fn().mockReturnValue(() =>
      Promise.resolve({
        extra_specs: { someKey: 'value' },
        id: 'abc'
      })
    );
  });

  it('fetches data and dispatches actions', () => {
    const store = mockStore({});
    const data = {
      abc: {
        id: 'abc',
        name: 'flavor',
        extra_specs: {
          someKey: 'value'
        }
      }
    };

    return store.dispatch(FlavorsActions.fetchFlavors()).then(() => {
      expect(NovaApiService.getFlavors).toHaveBeenCalled();
      expect(NovaApiService.getFlavorProfile).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        FlavorsActions.fetchFlavorsPending(),
        FlavorsActions.fetchFlavorsSuccess(data)
      ]);
    });
  });
});
