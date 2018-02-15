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

import { Map } from 'immutable';
import { FlavorsState, Flavor } from '../../js/immutableRecords/flavors';
import { getFlavorProfiles } from '../../js/selectors/flavors';

describe('flavor selectors', () => {
  const state = {
    flavors: new FlavorsState({
      flavors: Map({
        id1: new Flavor({
          id: 'id1',
          name: 'flavor 1',
          extra_specs: Map({
            'capabilities:profile': 'profile'
          })
        }),
        id2: new Flavor({
          id: 'id2',
          name: 'flavor 2',
          extra_specs: Map({
            'capabilities:profile': 'a profile'
          })
        }),
        id3: new Flavor({
          id: 'id3',
          name: 'flavor 3',
          extra_specs: Map({})
        })
      })
    })
  };

  it('selects flavor profiles', () => {
    expect(getFlavorProfiles(state).size).toEqual(2);
    expect(getFlavorProfiles(state).first()).toEqual('a profile');
  });
});
