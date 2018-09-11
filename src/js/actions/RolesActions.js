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
import { normalize } from 'normalizr';
import { startSubmit, stopSubmit } from 'redux-form';

import { handleErrors } from './ErrorActions';
import history from '../utils/history';
import RolesConstants from '../constants/RolesConstants';
import { roleSchema } from '../normalizrSchemas/roles';
import MistralApiService from '../services/MistralApiService';
import MistralConstants from '../constants/MistralConstants';
import { startWorkflow } from './WorkflowActions';
import { notify } from './NotificationActions';
import { sanitizeMessage } from '../utils';

const messages = defineMessages({
  availableRolesNotLoaded: {
    id: 'RolesActions.availableRolesNotLoaded',
    defaultMessage: 'Available Roles could not be loaded'
  }
});

export const fetchRoles = planName => dispatch => {
  dispatch(fetchRolesPending());

  dispatch(
    MistralApiService.runAction(MistralConstants.ROLE_LIST, {
      container: planName,
      detail: true
    })
  )
    .then(response => {
      const roles = normalize(response, [roleSchema]).entities.roles || {};
      dispatch(fetchRolesSuccess(roles));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Roles could not be loaded'));
      dispatch(fetchRolesFailed());
    });
};

export const fetchRolesPending = () => ({
  type: RolesConstants.FETCH_ROLES_PENDING
});

export const fetchRolesSuccess = roles => ({
  type: RolesConstants.FETCH_ROLES_SUCCESS,
  payload: roles
});

export const fetchRolesFailed = () => ({
  type: RolesConstants.FETCH_ROLES_FAILED
});

export const fetchAvailableRoles = planName => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(fetchAvailableRolesPending());
  dispatch(
    startWorkflow(
      MistralConstants.LIST_AVAILABLE_ROLES,
      { container: planName },
      fetchAvailableRolesFinished
    )
  ).catch(error => {
    history.push('/plans');
    dispatch(fetchAvailableRolesFailed());
    dispatch(
      handleErrors(error, formatMessage(messages.availableRolesNotLoaded))
    );
  });
};

export const fetchAvailableRolesFinished = ({
  output: { available_roles, message },
  state
}) => (dispatch, getState, { getIntl }) => {
  const { formatMessage } = getIntl(getState());
  if (state === 'SUCCESS') {
    const roles = normalize(available_roles, [roleSchema]).entities.roles || {};
    dispatch(fetchAvailableRolesSuccess(roles));
  } else {
    history.push('/plans');
    dispatch(fetchAvailableRolesFailed());
    dispatch(
      notify({
        title: formatMessage(messages.availableRolesNotLoaded),
        message: sanitizeMessage(message)
      })
    );
  }
};

export const fetchAvailableRolesPending = () => ({
  type: RolesConstants.FETCH_AVAILABLE_ROLES_PENDING
});

export const fetchAvailableRolesSuccess = roles => ({
  type: RolesConstants.FETCH_AVAILABLE_ROLES_SUCCESS,
  payload: roles
});

export const fetchAvailableRolesFailed = () => ({
  type: RolesConstants.FETCH_AVAILABLE_ROLES_FAILED
});

export const selectRoles = (planName, roleNames) => dispatch => {
  dispatch(startSubmit('selectRoles'));
  dispatch(
    startWorkflow(
      MistralConstants.SELECT_ROLES,
      {
        container: planName,
        role_names: roleNames
      },
      selectRolesFinished
    )
  ).catch(error => {
    const { name, message } = error;
    dispatch(stopSubmit('selectRoles', { _error: { title: name, message } }));
  });
};

export const selectRolesFinished = ({
  output: { selected_roles, message },
  state
}) => dispatch => {
  if (state === 'SUCCESS') {
    const roles = normalize(selected_roles, [roleSchema]).entities.roles || {};
    dispatch(selectRolesSuccess(roles));
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

export const selectRolesSuccess = roles => ({
  type: RolesConstants.SELECT_ROLES_SUCCESS,
  payload: roles
});
