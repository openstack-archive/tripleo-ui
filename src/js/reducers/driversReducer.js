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

import DriversConstants from '../constants/DriversConstants';
import { DriversState, Driver } from '../immutableRecords/drivers';

const initialState = new DriversState();

export default function driversReducer(state = initialState, action) {
  switch (action.type) {
    case DriversConstants.FETCH_DRIVERS_PENDING:
      return state.set('isFetching', true);

    case DriversConstants.FETCH_DRIVERS_FAILED:
      return state.set('isFetching', false);

    case DriversConstants.FETCH_DRIVERS_SUCCESS: {
      const drivers = fromJS(action.payload).map(driver => new Driver(driver));
      return state
        .set('drivers', drivers)
        .set('isLoaded', true)
        .set('isFetching', false);
    }

    default:
      return state;
  }
}
