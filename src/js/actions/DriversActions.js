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

import { normalize } from 'normalizr';

import { driverSchema } from '../normalizrSchemas/drivers';
import { handleErrors } from './ErrorActions';
import DriversConstants from '../constants/DriversConstants';
import IronicApiService from '../services/IronicApiService';

export default {
  // Redux actions
  fetchDriversPending() {
    return {
      type: DriversConstants.FETCH_DRIVERS_PENDING
    };
  },

  fetchDriversSuccess(drivers) {
    return {
      type: DriversConstants.FETCH_DRIVERS_SUCCESS,
      payload: drivers
    };
  },

  fetchDriversFailed() {
    return {
      type: DriversConstants.FETCH_DRIVERS_FAILED
    };
  },

  fetchDrivers() {
    return dispatch => {
      dispatch(this.fetchDriversPending());
      return dispatch(IronicApiService.getDrivers())
        .then(response => {
          const drivers = normalize(response.drivers, [driverSchema]).entities
            .drivers;
          dispatch(this.fetchDriversSuccess(drivers));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Drivers could not be loaded.'));
          dispatch(this.fetchDriversFailed());
        });
    };
  }
};
