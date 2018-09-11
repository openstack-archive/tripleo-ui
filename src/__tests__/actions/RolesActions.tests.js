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

import * as RolesActions from '../../js/actions/RolesActions';
import RolesConstants from '../../js/constants/RolesConstants';

describe('Roles actions', () => {
  it('should create an action for pending Roles request', () => {
    const expectedAction = {
      type: RolesConstants.FETCH_ROLES_PENDING
    };
    expect(RolesActions.fetchRolesPending()).toEqual(expectedAction);
  });

  it('should create an action for successful Roles retrieval', () => {
    const normalizedRolesResponse = {
      entities: {
        roles: {
          1: 'first role',
          2: 'second role'
        }
      },
      result: [1, 2]
    };
    const expectedAction = {
      type: RolesConstants.FETCH_ROLES_SUCCESS,
      payload: normalizedRolesResponse.entities.roles
    };
    expect(
      RolesActions.fetchRolesSuccess(normalizedRolesResponse.entities.roles)
    ).toEqual(expectedAction);
  });

  it('should create an action for failed Roles request', () => {
    const expectedAction = {
      type: RolesConstants.FETCH_ROLES_FAILED
    };
    expect(RolesActions.fetchRolesFailed()).toEqual(expectedAction);
  });
});
