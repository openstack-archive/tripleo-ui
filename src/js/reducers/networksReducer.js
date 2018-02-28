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

import { fromJS, Map } from 'immutable';

import NetworksConstants from '../constants/NetworksConstants';
import { Network, InitialNetworksState } from '../immutableRecords/networks';

const initialState = new InitialNetworksState();

const networksReducer = (state = initialState, action) => {
  switch (action.type) {
    case NetworksConstants.FETCH_NETWORKS_PENDING:
      return state.set('isFetching', true);

    case NetworksConstants.FETCH_NETWORKS_SUCCESS: {
      const networks = fromJS(action.payload).map(
        network => new Network(network)
      );
      return state
        .set('networks', networks)
        .set('isFetching', false)
        .set('loaded', true);
    }

    case NetworksConstants.FETCH_NETWORKS_FAILED:
      return state
        .set('networks', Map())
        .set('isFetching', false)
        .set('loaded', true);

    default:
      return state;
  }
};
export default networksReducer;
