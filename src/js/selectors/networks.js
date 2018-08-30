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

import { createSelector } from 'reselect';

import { getResources } from './parameters';

const networks = state => state.networks.networks;

export const getNetworks = createSelector(networks, networks =>
  // TODO(jtomasek): remove the filter once networks directory is enabled and
  // network-data.yaml includes only enabled networks
  networks.filter(n => n.enabled).sortBy(n => n.name)
);

export const getNetworkResourcesByNetwork = createSelector(
  [getResources, getNetworks],
  (resources, networks) =>
    networks.map(network =>
      resources.find(
        resource => resource.type === `OS::TripleO::Network::${network.name}`
      )
    )
);

export const getNetworkResourceExistsByNetwork = createSelector(
  getNetworkResourcesByNetwork,
  networkResources => networkResources.map(resource => !!resource)
);
