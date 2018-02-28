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

import { List, Map, Record } from 'immutable';

export const InitialNetworksState = Record({
  loaded: false,
  isFetching: false,
  networks: Map()
});

export const Network = Record({
  name: undefined,
  ip_subnet: undefined,
  vlan: undefined,
  enabled: undefined,
  vip: undefined,
  allocation_pools: List(),
  ipv6_allocation_pools: List(),
  name_lower: undefined,
  ipv6_subnet: undefined,
  gateway_ip: undefined,
  gateway_ipv6: undefined
});
