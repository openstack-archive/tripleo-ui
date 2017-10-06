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

import { normalize, arrayOf } from 'normalizr';

import { handleErrors } from './ErrorActions';
import RolesConstants from '../constants/RolesConstants';
import { roleSchema } from '../normalizrSchemas/roles';
import MistralApiService from '../services/MistralApiService';
import MistralConstants from '../constants/MistralConstants';

export default {
  fetchRoles(planName) {
    return (dispatch, getState) => {
      dispatch(this.fetchRolesPending());

      MistralApiService.runAction(MistralConstants.ROLE_LIST, {
        container: planName,
        detail: true
      })
        .then(response => {
          const roles = normalize(response, arrayOf(roleSchema)).entities
            .roles || {};
          dispatch(this.fetchRolesSuccess(roles));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Roles could not be loaded'));
          dispatch(this.fetchRolesFailed());
        });
    };
  },

  fetchRolesPending() {
    return {
      type: RolesConstants.FETCH_ROLES_PENDING
    };
  },

  fetchRolesSuccess(roles) {
    return {
      type: RolesConstants.FETCH_ROLES_SUCCESS,
      payload: roles
    };
  },

  fetchRolesFailed() {
    return {
      type: RolesConstants.FETCH_ROLES_FAILED
    };
  },

  fetchAvailableRoles(planName) {
    return (dispatch, getState) => {
      dispatch(this.fetchAvailableRolesPending());

      MistralApiService.runAction(MistralConstants.AVAILABLE_ROLE_LIST, {
        container: planName
      })
        .then(response => {
          const roles = normalize(response, arrayOf(roleSchema)).entities
            .roles || {};
          dispatch(this.fetchAvailableRolesSuccess(roles));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Available Roles could not be loaded'));
          dispatch(this.fetchAvailableRolesFailed());
        });
    };
  },

  fetchAvailableRolesPending() {
    return {
      type: RolesConstants.FETCH_AVAILABLE_ROLES_PENDING
    };
  },

  fetchAvailableRolesSuccess(roles) {
    return {
      type: RolesConstants.FETCH_AVAILABLE_ROLES_SUCCESS,
      payload: roles
    };
  },

  fetchAvailableRolesFailed() {
    return {
      type: RolesConstants.FETCH_AVAILABLE_ROLES_FAILED
    };
  }
};
