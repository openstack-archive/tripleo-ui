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

import { List, Map, Record, Set } from 'immutable';

export const NodesState = Record({
  isFetching: false,
  isLoaded: false,
  nodesInProgress: Set(),
  all: Map(),
  ports: Map(),
  introspectionStatuses: Map()
});

export const NodeToRegister = Record({
  uuid: undefined,
  name: undefined,
  mac: List(),
  pm_type: 'pxe_ssh',
  pm_user: undefined,
  pm_addr: undefined,
  pm_password: undefined,
  pm_port: undefined,
  arch: undefined,
  cpu: undefined,
  memory: undefined,
  disk: undefined,
  valid: false
});

export const IronicNode = Record({
  // uuid: undefined, TODO(jtomasek): re-add this once registration supports passing uuid
  name: undefined,
  mac: List(),
  pm_type: 'pxe_ssh',
  pm_user: undefined,
  pm_addr: undefined,
  pm_password: undefined,
  pm_port: undefined,
  arch: undefined,
  cpu: undefined,
  memory: undefined,
  disk: undefined,
  capabilities: 'boot_option:local'
});

export const Port = Record({
  uuid: undefined,
  address: undefined,
  node_uuid: undefined
});

export const IntrospectionStatus = Record({
  error: undefined,
  finished: false,
  finished_at: undefined,
  started_at: undefined,
  state: 'not introspected',
  uuid: undefined
});
