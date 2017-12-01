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

import { createSelector } from 'reselect';

import { Role } from '../immutableRecords/roles';

export const getRoles = state =>
  state.roles.roles.sortBy(r => r.name.toLowerCase());

export const getRole = (state, roleName) =>
  state.roles.get('roles').get(roleName, new Role());

export const getAvailableRoles = state =>
  state.availableRoles.roles.sortBy(r => r.name.toLowerCase());

export const getMergedRoles = createSelector(
  [getRoles, getAvailableRoles],
  (roles, availableRoles) => roles.merge(availableRoles).sortBy(r => r.name)
);
