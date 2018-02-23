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
import React, { Fragment } from 'react';
import { List } from 'immutable';

import { splitListIntoChunks } from '../../utils/immutablejs';
import RoleCard from './RoleCard';
import { Role } from '../../immutableRecords/roles';

const RolesList = ({ roles, networkLinePositions }) => {
  const rolesChunks = splitListIntoChunks(roles.toList(), 2);
  return (
    <Fragment>
      <div className="roles-list">
        {rolesChunks
          .get(0)
          .map(role => (
            <RoleCard
              key={role.name}
              networkLinePositions={networkLinePositions}
              role={role}
            />
          ))}
      </div>
      <div className="roles-list">
        <RoleCard
          role={new Role({ name: 'Undercloud', identifier: 'undercloud' })}
          networkLinePositions={networkLinePositions}
        />
      </div>
      <div className="roles-list">
        {rolesChunks
          .get(1)
          .map(role => (
            <RoleCard
              key={role.name}
              networkLinePositions={networkLinePositions}
              role={role}
            />
          ))}
      </div>
    </Fragment>
  );
};
RolesList.propTypes = {
  networkLinePositions: PropTypes.object.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};

export default RolesList;
