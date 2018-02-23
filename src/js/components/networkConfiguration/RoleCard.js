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
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import RoleNetworkLine from './RoleNetworkLine';

export class RoleCard extends Component {
  render() {
    const { role: { name, networks }, networkLinePositions } = this.props;
    const allNetworks = networks.unshift('Provisioning');
    return (
      <div className="card-pf card-pf-view card-pf-view-select role-card">
        <div className="card-pf-body">
          <h2 className="card-pf-title">{name}</h2>
        </div>
        <div className="card-pf-footer">
          <ul className="role-networks-list list-unstyled">
            {allNetworks.map(network => (
              <RoleNetworkLine
                key={network}
                networkName={network}
                networkLinePosition={networkLinePositions[network]}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
RoleCard.propTypes = {
  networkLinePositions: PropTypes.object,
  role: ImmutablePropTypes.record.isRequired
};

export default RoleCard;
