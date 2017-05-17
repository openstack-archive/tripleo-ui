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

import { Role } from '../../js/immutableRecords/roles';
import PlansConstants from '../../js/constants/PlansConstants';
import RolesConstants from '../../js/constants/RolesConstants';
import rolesReducer from '../../js/reducers/rolesReducer';

describe('rolesReducer', () => {
  const initialState = Map({
    loaded: false,
    isFetching: false,
    roles: Map()
  });

  const updatedState = Map({
    loaded: true,
    isFetching: false,
    roles: Map({
      control: new Role({
        title: 'Controller',
        name: 'Controller',
        identifier: 'control'
      })
    })
  });

  it('should return initial state', () => {
    expect(rolesReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle FETCH_ROLES_PENDING', () => {
    const action = {
      type: RolesConstants.FETCH_ROLES_PENDING
    };
    const newState = rolesReducer(initialState, action);
    expect(newState.get('isFetching')).toEqual(true);
  });

  it('should handle FETCH_ROLES_SUCCESS', () => {
    const action = {
      type: RolesConstants.FETCH_ROLES_SUCCESS,
      payload: ['Controller']
    };
    const newState = rolesReducer(initialState, action);
    expect(newState.get('roles')).toEqual(updatedState.get('roles'));
    expect(newState.get('loaded')).toEqual(true);
  });

  it('should handle FETCH_ROLES_FAILED', () => {
    const action = {
      type: RolesConstants.FETCH_ROLES_FAILED
    };
    const newState = rolesReducer(initialState, action);
    expect(newState.get('loaded')).toEqual(true);
    expect(newState.get('roles')).toEqual(Map());
  });

  it('should handle PLAN_CHOSEN', () => {
    const action = {
      type: PlansConstants.PLAN_CHOSEN
    };
    const newState = rolesReducer(updatedState, action);
    expect(newState.get('loaded')).toEqual(false);
  });
});
