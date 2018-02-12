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
import { FlavorsState } from '../../js/immutableRecords/flavors';
import flavorsReducer from '../../js/reducers/flavorsReducer';
import FlavorsConstants from '../../js/constants/FlavorsConstants';

describe('flavorsReducer', () => {
  const initialState = new FlavorsState({
    isFetching: false,
    flavors: Map()
  });

  it('should return initial state', () => {
    expect(flavorsReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle update to pending', () => {
    const action = {
      type: FlavorsConstants.FETCH_FLAVORS_PENDING
    };
    const newState = flavorsReducer(initialState, action);
    expect(newState.get('isFetching')).toBeTruthy();
  });

  it('should handle update to success', () => {
    const action = {
      type: FlavorsConstants.FETCH_FLAVORS_SUCCESS,
      payload: {
        abc: {
          name: 'flavor name',
          id: 'abc',
          extra_specs: {
            someKey: 'value'
          }
        }
      }
    };
    const newState = flavorsReducer(initialState, action);
    expect(newState.get('isFetching')).toBeFalsy();
    expect(newState.get('isLoaded')).toBeTruthy();
    expect(newState.flavors.isEmpty()).toBeFalsy();
    expect(newState.flavors.size).toEqual(1);
    expect(newState.flavors.getIn(['abc', 'extra_specs', 'someKey'])).toEqual(
      'value'
    );
  });
});
