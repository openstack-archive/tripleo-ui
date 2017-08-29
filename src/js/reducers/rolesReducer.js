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

import { fromJS, Map } from 'immutable'
import { kebabCase, startCase } from 'lodash'

import PlansConstants from '../constants/PlansConstants'
import RolesConstants from '../constants/RolesConstants'
import { Role, RolesState } from '../immutableRecords/roles'

const initialState = new RolesState()

export default function rolesReducer(state = initialState, action) {
  switch (action.type) {
    case RolesConstants.FETCH_ROLES_PENDING:
      return state.set('isFetching', true)

    case RolesConstants.FETCH_ROLES_SUCCESS: {
      // Convert roles array into Map of Role records. This could get replaced by normalizing
      // once the mistral getRoles action returns an array of objects
      const roles = fromJS(action.payload).reduce(
        (result, role) =>
          result.set(_getRoleIdentifier(role), _createRole(role)),
        Map()
      )

      return state
        .set('roles', fromJS(roles).map(role => new Role(role)))
        .set('isFetching', false)
        .set('loaded', true)
    }

    case RolesConstants.FETCH_ROLES_FAILED:
      return state
        .set('roles', Map())
        .set('isFetching', false)
        .set('loaded', true)

    case PlansConstants.PLAN_CHOSEN:
      return state.set('loaded', false)

    default:
      return state
  }
}

const _createRole = roleName => {
  return new Role({
    name: roleName,
    title: startCase(roleName),
    identifier: _getRoleIdentifier(roleName)
  })
}

// TODO(jtomasek): Controller role name and tag don't follow naming convention
// Remove this after controller tag is renamed from control to controller
const _getRoleIdentifier = roleName => {
  if (roleName === 'Controller') {
    return 'control'
  }
  return kebabCase(roleName)
}
