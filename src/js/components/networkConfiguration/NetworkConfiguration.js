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
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { checkRunningDeployment } from '../utils/checkRunningDeploymentHOC';
import { getCurrentPlanName } from '../../selectors/plans';
import { getNetworks } from '../../selectors/networks';
import { getRoles } from '../../selectors/roles';
import { getParameters } from '../../selectors/parameters';
import { Loader } from '../ui/Loader';
import NetworkTopology from './NetworkTopology';
import ParametersActions from '../../actions/ParametersActions';
import NetworksActions from '../../actions/NetworksActions';
import RolesActions from '../../actions/RolesActions';
import {
  CloseModalXButton,
  CloseModalButton,
  RoutedModalPanel
} from '../ui/Modals';

const messages = defineMessages({
  close: {
    id: 'NetworkConfiuguration.close',
    defaultMessage: 'Close'
  },
  networkConfiguration: {
    id: 'NetworkConfiguration.networkConfiguration',
    defaultMessage: 'Network Configuration'
  },
  loadingData: {
    id: 'NetworkConfiguration.loadingData',
    defaultMessage: 'Loading data...'
  }
});

class NetworkConfiguration extends Component {
  componentDidMount() {
    const {
      currentPlanName,
      fetchNetworks,
      fetchParameters,
      fetchRoles,
      isFetchingNetworks,
      isFetchingParameters,
      isFetchingRoles
    } = this.props;
    !isFetchingRoles && fetchRoles(currentPlanName);
    !isFetchingParameters && fetchParameters(currentPlanName);
    !isFetchingNetworks && fetchNetworks(currentPlanName);
  }

  render() {
    const {
      currentPlanName,
      intl: { formatMessage },
      isFetchingNetworks,
      isFetchingRoles,
      isFetchingParameters,
      networks,
      roles
    } = this.props;
    return (
      <RoutedModalPanel
        id="NetworkConfiguration__ModalDialog"
        redirectPath={`/plans/${currentPlanName}`}
      >
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage {...messages.networkConfiguration} />
          </ModalTitle>
        </ModalHeader>

        <Loader
          height={60}
          loaded={
            !isFetchingRoles && !isFetchingParameters && !isFetchingNetworks
          }
          className="flex-container"
          content={formatMessage(messages.loadingData)}
          componentProps={{ className: 'flex-container' }}
        >
          <ModalBody className="flex-container">
            {/*<NetworkConfigurationToolbar/>*/}
            <NetworkTopology networks={networks} roles={roles} />
          </ModalBody>
        </Loader>
        <ModalFooter>
          <CloseModalButton>
            <FormattedMessage {...messages.close} />
          </CloseModalButton>
        </ModalFooter>
      </RoutedModalPanel>
    );
  }
}
NetworkConfiguration.propTypes = {
  currentPlanName: PropTypes.string.isRequired,
  fetchNetworks: PropTypes.func.isRequired,
  fetchParameters: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isFetchingNetworks: PropTypes.bool.isRequired,
  isFetchingParameters: PropTypes.bool.isRequired,
  isFetchingRoles: PropTypes.bool.isRequired,
  networks: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};

const mapStateToProps = state => ({
  currentPlanName: getCurrentPlanName(state),
  parameters: getParameters(state),
  isFetchingNetworks: state.networks.isFetching,
  isFetchingParameters: state.parameters.isFetching,
  networks: getNetworks(state),
  roles: getRoles(state),
  isFetchingRoles: state.roles.isFetching
});

const mapDispatchToProps = dispatch => ({
  fetchNetworks: planName => dispatch(NetworksActions.fetchNetworks(planName)),
  fetchRoles: planName => dispatch(RolesActions.fetchRoles(planName)),
  fetchParameters: planName =>
    dispatch(ParametersActions.fetchParameters(planName))
});

export default checkRunningDeployment(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(NetworkConfiguration))
);
