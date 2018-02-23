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

import NetworkListItem from './NetworkListItem';
import RolesList from './RolesList';

export default class NetworkTopology extends Component {
  constructor() {
    super();
    this.networkLineElements = {};
    this.state = { networkLinePositions: {} };
  }
  componentDidMount() {
    this.calculateNetworkPositions();
  }

  calculateNetworkPositions = () => {
    Object.keys(this.networkLineElements).map(key => {
      const rect = this.networkLineElements[key].getBoundingClientRect();
      this.setState(state => (state.networkLinePositions[key] = rect.y));
    });
  };

  render() {
    const { roles, networks } = this.props;
    return (
      <div className="flex-row network-topology">
        <div className="flex-column col-xs-12">
          <RolesList
            roles={roles}
            networkLinePositions={this.state.networkLinePositions}
          />
          <ul className="list-unstyled">
            {networks
              .keySeq()
              .map(network => (
                <NetworkListItem
                  lineRef={el => (this.networkLineElements[network] = el)}
                  key={network}
                  name={network}
                />
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
NetworkTopology.propTypes = {
  networks: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};
