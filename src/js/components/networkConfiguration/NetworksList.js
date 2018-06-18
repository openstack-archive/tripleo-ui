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

import NetworkListItem from './NetworkListItem';

const NetworksList = ({
  networks,
  parameters,
  networkLineElements,
  networkResourceExistsByNetwork
}) => {
  const ctlPlaneDefaultRoute = parameters.get('ControlPlaneDefaultRoute');
  const ctlPlaneSubnetCidr = parameters.get('ControlPlaneSubnetCidr');
  return (
    <Fragment>
      <NetworkListItem
        lineRef={el => (networkLineElements['Provisioning'] = el)}
        key="ControlPlane"
        name="Provisioning"
      >
        {ctlPlaneDefaultRoute && (
          <small
            title={`${ctlPlaneDefaultRoute.name} - ${
              ctlPlaneDefaultRoute.description
            }`}
          >
            {ctlPlaneDefaultRoute.value || ctlPlaneDefaultRoute.default}
          </small>
        )}{' '}
        {ctlPlaneSubnetCidr && (
          <small
            title={`${ctlPlaneSubnetCidr.name} - ${
              ctlPlaneSubnetCidr.description
            }`}
          >
            (CIDR: {ctlPlaneSubnetCidr.value || ctlPlaneSubnetCidr.default})
          </small>
        )}
      </NetworkListItem>
      {networks.keySeq().map(network => {
        const netCidr = parameters.get(`${network}NetCidr`);
        const vlanID = parameters.get(`${network}NetworkVlanID`);
        return (
          <NetworkListItem
            lineRef={el => (networkLineElements[network] = el)}
            key={network}
            name={network}
            disabled={!networkResourceExistsByNetwork.get(network)}
          >
            {netCidr && (
              <small title={`${netCidr.name} - ${netCidr.description}`}>
                {netCidr.value || netCidr.default}
              </small>
            )}{' '}
            {vlanID && (
              <small title={`${vlanID.name} - ${vlanID.description}`}>
                (VLAN ID: {vlanID.value || vlanID.default})
              </small>
            )}
          </NetworkListItem>
        );
      })}
    </Fragment>
  );
};
NetworksList.propTypes = {
  networkLineElements: PropTypes.object.isRequired,
  networkResourceExistsByNetwork: ImmutablePropTypes.map.isRequired,
  networks: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired
};

export default NetworksList;
