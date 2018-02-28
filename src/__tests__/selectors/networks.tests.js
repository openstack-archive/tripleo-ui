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

import { Map } from 'immutable';

import {
  InitialNetworksState,
  Network
} from '../../js/immutableRecords/networks';
import { getNetworks } from '../../js/selectors/networks';

describe('networks selectors', () => {
  describe('getNetworks()', () => {
    const state = {
      networks: new InitialNetworksState({
        loaded: false,
        isFetching: false,
        networks: Map({
          aNetwork1: new Network({
            name: 'aNetwork1'
          }),
          bNetwork2: new Network({
            name: 'bNetwork2'
          })
        })
      })
    };

    it('gets all networks', () => {
      expect(getNetworks(state).size).toEqual(2);
      expect(getNetworks(state).first().name).toEqual('aNetwork1');
    });
  });
});
