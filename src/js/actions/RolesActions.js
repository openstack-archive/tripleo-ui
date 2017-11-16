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

import { defineMessages } from 'react-intl';
import { normalize, arrayOf } from 'normalizr';
import { startSubmit, stopSubmit } from 'redux-form';

import { handleErrors } from './ErrorActions';
import RolesConstants from '../constants/RolesConstants';
import { roleSchema } from '../normalizrSchemas/roles';
import MistralApiService from '../services/MistralApiService';
import MistralConstants from '../constants/MistralConstants';

const messages = defineMessages({
  availableRolesNotLoaded: {
    id: 'RolesActions.availableRolesNotLoaded',
    defaultMessage: 'Available Roles could not be loaded'
  }
});

export default {
  fetchRoles(planName) {
    return (dispatch, getState) => {
      dispatch(this.fetchRolesPending());

      dispatch(
        MistralApiService.runAction(MistralConstants.ROLE_LIST, {
          container: planName,
          detail: true
        })
      )
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
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.fetchAvailableRolesPending());
      dispatch(
        MistralApiService.runWorkflow(MistralConstants.LIST_AVAILABLE_ROLES, {
          container: planName
        })
      ).catch(error => {
        dispatch(
          handleErrors(error, formatMessage(messages.availableRolesNotLoaded))
        );
      });
    };
  },

  fetchAvailableRolesFinished({ available_roles, message, status }, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      if (status === 'SUCCESS') {
        const roles = normalize(available_roles, arrayOf(roleSchema)).entities
          .roles || {};
        dispatch(this.fetchAvailableRolesSuccess(roles));
      } else {
        dispatch(
          handleErrors(message, formatMessage(messages.availableRolesNotLoaded))
        );
        history.push('/plans');
        dispatch(this.fetchAvailableRolesFailed());
      }
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
  },

  selectRoles(planName, roleNames) {
    return (dispatch, getState) => {
      dispatch(startSubmit('selectRoles'));
      dispatch(
        MistralApiService.runWorkflow(MistralConstants.SELECT_ROLES, {
          container: planName,
          role_names: roleNames
        })
      ).catch(error => {
        const { name, message } = error;
        dispatch(
          stopSubmit('selectRoles', { _error: { title: name, message } })
        );
      });
    };
  },

  selectRolesFinished({ selected_roles, message, status, ...rest }, history) {
    return (dispatch, getState) => {
      if (status === 'SUCCESS') {
        const roles = normalize(selected_roles, arrayOf(roleSchema)).entities
          .roles || {};
        dispatch(this.selectRolesSuccess(roles));
        dispatch(stopSubmit('selectRoles'));
        history.push('/plans');
      } else {
        dispatch(
          stopSubmit('selectRoles', {
            _error: { message: message.message || message }
          })
        );
      }
    };
  },

  selectRolesSuccess(roles) {
    return {
      type: RolesConstants.SELECT_ROLES_SUCCESS,
      payload: roles
    };
  }
};
