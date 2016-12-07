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

import { List, Map, OrderedMap, Record } from 'immutable';

export const StacksState = Record({
  currentStackEnvironment: Map(),
  isRequestingStackDelete: false,
  isLoaded: false,
  isFetching: false,
  isFetchingResources: false,
  isFetchingEnvironment: false,
  resourcesLoaded: false,
  resources: OrderedMap(),
  resourceDetails: Map(),
  stacks: Map()
});

export const Stack = Record({
  creation_time: undefined,
  deletion_time: undefined,
  description: undefined,
  id: undefined,
  parent: undefined,
  stack_name: undefined,
  stack_owner: undefined,
  stack_status: undefined,
  stack_status_reason: undefined,
  stack_user_project_id: undefined,
  tags: Map(),
  updated_time: undefined
});

export const StackResource = Record({
  attributes: undefined,
  creation_time: undefined,
  links: List(),
  logical_resource_id: undefined,
  physical_resource_id: undefined,
  required_by: List(),
  resource_name: undefined,
  resource_status: undefined,
  resource_status_reason: undefined,
  resource_type: undefined,
  updated_time: undefined
});
