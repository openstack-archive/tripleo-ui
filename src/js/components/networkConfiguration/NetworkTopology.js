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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { Component } from 'react';
import { debounce } from 'lodash';
import { Alert } from 'patternfly-react';

import {
  getNetworks,
  getNetworkResourceExistsByNetwork
} from '../../selectors/networks';
import { getParameters } from '../../selectors/parameters';
import { getRoles } from '../../selectors/roles';
import NetworksHighlighter from './NetworksHighlighter';
import RolesList from './RolesList';
import NetworksList from './NetworksList';

const messages = defineMessages({
  networkIsolationWarning: {
    id: 'NetworkConfiguration.networkIsolationWarning',
    defaultMessage:
      'Resource definition for some networks is missing. Please enable Network Isolation.'
  }
});

class NetworkTopology extends Component {
  constructor(props) {
    super(props);
    this.networkLineElements = {};
    this.roleNetworkLineElements = {};
    this.state = { networkLineHeights: {} };

    this.calculateNetworkLineHeights = debounce(
      this.calculateNetworkLineHeights,
      100
    );
  }

  componentDidMount() {
    this.calculateNetworkLineHeights();
  }

  calculateNetworkLineHeights = () => {
    const resultObject = Object.assign({}, this.roleNetworkLineElements);
    Object.keys(this.roleNetworkLineElements).forEach(role =>
      Object.keys(this.roleNetworkLineElements[role]).forEach(network => {
        const { y, height } = this.roleNetworkLineElements[role][
          network
        ].getBoundingClientRect();
        const start = y + height;
        const end = this.networkLineElements[network].getBoundingClientRect().y;
        resultObject[role][network] = end - start;
      })
    );

    this.setState({ networkLineHeights: resultObject });
  };

  render() {
    const {
      roles,
      networkResourceExistsByNetwork,
      networks,
      parameters
    } = this.props;
    return (
      <NetworksHighlighter>
        {networkResourceExistsByNetwork.includes(false) && (
          <Alert type="info">
            <FormattedMessage {...messages.networkIsolationWarning} />
          </Alert>
        )}
        <div className="network-topology">
          <RolesList
            roles={roles}
            networkLineHeights={this.state.networkLineHeights}
            roleNetworkLineElements={this.roleNetworkLineElements}
          />
          <NetworksList
            networks={networks}
            networkResourceExistsByNetwork={networkResourceExistsByNetwork}
            parameters={parameters}
            networkLineElements={this.networkLineElements}
          />
        </div>
      </NetworksHighlighter>
    );
  }
}
NetworkTopology.propTypes = {
  networkResourceExistsByNetwork: ImmutablePropTypes.map.isRequired,
  networks: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};

const mapStateToProps = state => ({
  networkResourceExistsByNetwork: getNetworkResourceExistsByNetwork(state),
  networks: getNetworks(state),
  parameters: getParameters(state),
  roles: getRoles(state)
});

export default connect(mapStateToProps)(NetworkTopology);
