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

import { splitListIntoChunks } from '../../utils/immutablejs';
import RoleCard from './RoleCard';
import { Role } from '../../immutableRecords/roles';

const RolesList = ({ roles, networkLineHeights, roleNetworkLineElements }) => {
  const rolesChunks = splitListIntoChunks(roles.toList(), 2);
  return (
    <Fragment>
      <div className="roles-list">
        {rolesChunks
          .get(0)
          .map(role => (
            <RoleCard
              key={role.name}
              networkLineHeights={networkLineHeights[role.name]}
              role={role}
              roleNetworkLineElements={roleNetworkLineElements}
            />
          ))}
      </div>
      <div className="roles-list">
        <RoleCard
          networkLineHeights={networkLineHeights['Undercloud']}
          role={new Role({ name: 'Undercloud', identifier: 'undercloud' })}
          roleNetworkLineElements={roleNetworkLineElements}
        />
      </div>
      <div className="roles-list">
        {rolesChunks
          .get(1)
          .map(role => (
            <RoleCard
              key={role.name}
              networkLineHeights={networkLineHeights[role.name]}
              role={role}
              roleNetworkLineElements={roleNetworkLineElements}
            />
          ))}
      </div>
    </Fragment>
  );
};
RolesList.propTypes = {
  networkLineHeights: PropTypes.object.isRequired,
  roleNetworkLineElements: PropTypes.object.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};
RolesList.defaultProps = {
  networkLineHeights: {}
};

export default RolesList;
