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
import React from 'react';
import { List } from 'immutable';

import { splitListIntoChunks } from '../../utils/immutablejs';
import RoleCard from './RoleCard';

const RolesList = ({ roles, networkLinePositions }) => {
  const rolesChunks = splitListIntoChunks(roles.toList(), 2);
  return (
    <ul className="list-unstyled network-roles-list">
      {rolesChunks.map((chunk, i) => (
        <React.Fragment key={i}>
          <li className="network-roles-group">
            <ul className="list-unstyled network-roles-list">
              {chunk.map(role => (
                <li key={role.name} className="network-role-card">
                  <RoleCard
                    networkLinePositions={networkLinePositions}
                    name={role.name}
                    networks={role.networks}
                  />
                </li>
              ))}
            </ul>
          </li>
          {i % 2 === 0 && (
            <li className="network-role-card undercloud">
              <RoleCard name="Undercloud" networks={List()} />
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};
RolesList.propTypes = {
  networkLinePositions: PropTypes.object.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};

export default RolesList;
