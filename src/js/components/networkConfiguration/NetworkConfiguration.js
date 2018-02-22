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
import { getRoles } from '../../selectors/roles';
import { getParameters } from '../../selectors/parameters';
import { Loader } from '../ui/Loader';
import ParametersActions from '../../actions/ParametersActions';
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
      fetchParameters,
      fetchRoles,
      isFetchingParameters,
      isFetchingRoles
    } = this.props;
    !isFetchingRoles && fetchRoles();
    !isFetchingParameters && fetchParameters();
  }

  render() {
    const {
      currentPlanName,
      intl: { formatMessage },
      isFetchingRoles,
      isFetchingParameters
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
          loaded={!isFetchingRoles && !isFetchingParameters}
          className="flex-container"
          content={formatMessage(messages.loadingData)}
          componentProps={{ className: 'flex-container' }}
        >
          <ModalBody className="flex-container">
            {/*<NetworkConfigurationToolbar/>*/}
            {/*<NetworkTopology roles={roles} />*/}
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
  fetchParameters: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isFetchingParameters: PropTypes.bool.isRequired,
  isFetchingRoles: PropTypes.bool.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  parametersLoaded: PropTypes.bool.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  rolesLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  currentPlanName: getCurrentPlanName(state),
  parameters: getParameters(state),
  parametersLoaded: state.parameters.loaded,
  isFetchingParameters: state.parameters.isFetching,
  roles: getRoles(state),
  rolesLoaded: state.roles.loaded,
  isFetchingRoles: state.roles.isFetching
});

const mapDispatchToProps = dispatch => ({
  fetchRoles: planName => dispatch(RolesActions.fetchRoles(planName)),
  fetchParameters: planName =>
    dispatch(ParametersActions.fetchParameters(planName))
});

export default checkRunningDeployment(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(NetworkConfiguration))
);
