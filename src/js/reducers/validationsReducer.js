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

import { fromJS } from 'immutable';

import ValidationsConstants from '../constants/ValidationsConstants';
import { Validation, ValidationsState } from '../immutableRecords/validations';

const initialState = new ValidationsState();

export default function validationsReducer(state = initialState, action) {
  switch (action.type) {
    case ValidationsConstants.FETCH_VALIDATIONS_PENDING: {
      return state.set('isFetching', true);
    }

    case ValidationsConstants.FETCH_VALIDATIONS_SUCCESS: {
      const validations = fromJS(action.payload);

      return state
        .set(
          'validations',
          validations.map(validation => new Validation(validation))
        )
        .set('isFetching', false)
        .set('validationsLoaded', true);
    }

    case ValidationsConstants.FETCH_VALIDATIONS_FAILED:
      return state.set('isFetching', false).set('validationsLoaded', true);

    case ValidationsConstants.TOGGLE_VALIDATIONS:
      return state.set('showValidations', !state.showValidations);

    default:
      return state;
  }
}
