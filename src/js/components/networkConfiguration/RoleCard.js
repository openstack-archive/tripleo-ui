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
import { set } from 'lodash';

import RoleNetworkLine from './RoleNetworkLine';

export class RoleCard extends Component {
  render() {
    const {
      networkLineHeights,
      role: { name, networks },
      roleNetworkLineElements
    } = this.props;
    const allNetworks = networks.unshift('Provisioning');
    return (
      <div className="card-pf card-pf-view role-card">
        <div className="card-pf-body">
          <h2 className="card-pf-title">{name}</h2>
        </div>
        <div className="card-pf-footer">
          <ul className="role-networks-list list-unstyled">
            {allNetworks.map(network => (
              <RoleNetworkLine
                lineRef={el =>
                  set(roleNetworkLineElements, [name, network], el)
                }
                key={network}
                networkName={network}
                networkLineHeight={networkLineHeights[network]}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
RoleCard.propTypes = {
  networkLineHeights: PropTypes.object.isRequired,
  role: ImmutablePropTypes.record.isRequired,
  roleNetworkLineElements: PropTypes.object.isRequired
};
RoleCard.defaultProps = {
  networkLineHeights: {}
};

export default RoleCard;
