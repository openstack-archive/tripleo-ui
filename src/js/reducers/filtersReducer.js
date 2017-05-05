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
import uuid from 'node-uuid';

import FiltersConstants from '../constants/FiltersConstants';
import { ActiveFilter, FiltersInitialState } from '../immutableRecords/filters';

const initialState = new FiltersInitialState();

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case FiltersConstants.ADD_ACTIVE_FILTER: {
      const filterUUID = uuid.v4();
      const { filter, data: { filterBy, filterString } } = action.payload;
      return state.setIn(
        [filter, 'activeFilters', filterUUID],
        new ActiveFilter({ uuid: filterUUID, filterBy, filterString })
      );
    }
    case FiltersConstants.UPDATE_FILTER: {
      const { filter, data } = action.payload;
      return state.update(filter, filter => filter.merge(Map(data)));
    }
    case FiltersConstants.DELETE_ACTIVE_FILTER:
      return state.deleteIn([
        action.payload.filter,
        'activeFilters',
        action.payload.activeFilterUUID
      ]);
    case FiltersConstants.CLEAR_ACTIVE_FILTERS:
      return state.setIn([action.payload, 'activeFilters'], Map());
    default:
      return state;
  }
}
