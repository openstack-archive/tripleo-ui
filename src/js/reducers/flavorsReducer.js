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

import { fromJS } from 'immutable';

import FlavorsConstants from '../constants/FlavorsConstants';
import { FlavorsState, Flavor } from '../immutableRecords/flavors';

const initialState = new FlavorsState();

export default function flavorsReducer(state = initialState, action) {
  switch (action.type) {
    case FlavorsConstants.FETCH_FLAVORS_PENDING:
      return state.set('isFetching', true);

    case FlavorsConstants.FETCH_FLAVORS_FAILED:
      return state.set('isFetching', false);

    case FlavorsConstants.FETCH_FLAVORS_SUCCESS: {
      const flavors = fromJS(action.payload).map(flavor => new Flavor(flavor));
      return state
        .set('flavors', flavors)
        .set('isLoaded', true)
        .set('isFetching', false);
    }

    default:
      return state;
  }
}
