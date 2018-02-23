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

import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { Component } from 'react';
import { debounce } from 'lodash';

import RolesList from './RolesList';
import NetworksList from './NetworksList';

export default class NetworkTopology extends Component {
  constructor() {
    super();
    this.networkLineElements = {};
    this.state = { networkLinePositions: {} };

    this.calculateNetworkPositions = debounce(
      this.calculateNetworkPositions,
      100
    );
  }

  componentDidMount() {
    this.calculateNetworkPositions();
  }

  calculateNetworkPositions = () =>
    Object.keys(this.networkLineElements).map(key => {
      const rect = this.networkLineElements[key].getBoundingClientRect();
      this.setState(state => (state.networkLinePositions[key] = rect.y));
    });

  render() {
    const { roles, networks, parameters } = this.props;
    return (
      <div className="network-topology">
        <RolesList
          roles={roles}
          networkLinePositions={this.state.networkLinePositions}
        />
        <NetworksList
          networks={networks}
          parameters={parameters}
          networkLineElements={this.networkLineElements}
        />
      </div>
    );
  }
}
NetworkTopology.propTypes = {
  networks: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};
