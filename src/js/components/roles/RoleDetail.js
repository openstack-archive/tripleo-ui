/**
 * Copyright 2017 Red Hat Inc.
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
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { ModalHeader, ModalTitle } from 'react-bootstrap';

import { checkRunningDeployment } from '../utils/checkRunningDeploymentHOC';
import { getCurrentPlanName } from '../../selectors/plans';
import { getRole } from '../../selectors/roles';
import { Loader } from '../ui/Loader';
import { CloseModalXButton, RoutedModalPanel } from '../ui/Modals';
import NavTab from '../ui/NavTab';
import {
  fetchParameters,
  updateParameters
} from '../../actions/ParametersActions';
import ParametersForm from '../parameters/ParametersForm';
import RoleNetworkConfig from './RoleNetworkConfig';
import RoleParameters from './RoleParameters';
import RoleServices from './RoleServices';

const messages = defineMessages({
  cancel: {
    id: 'RoleDetail.cancel',
    defaultMessage: 'Cancel'
  },
  networkConfiguration: {
    id: 'RoleDetail.networkConfiguration',
    defaultMessage: 'Network Configuration'
  },
  parameters: {
    id: 'RoleDetail.parameters',
    defaultMessage: 'Parameters'
  },
  role: {
    id: 'RoleDetail.role',
    defaultMessage: '{roleName} Role'
  },
  loadingParameters: {
    id: 'RoleDetail.loadingParameters',
    defaultMessage: 'Loading parameters...'
  },
  updatingParameters: {
    id: 'RoleDetail.updatingParameters',
    defaultMessage: 'Updating parameters...'
  },
  saveChanges: {
    id: 'RoleDetail.saveChanges',
    defaultMessage: 'Save Changes'
  },
  services: {
    id: 'RoleDetail.services',
    defaultMessage: 'Services'
  }
});

class RoleDetail extends React.Component {
  componentDidMount() {
    const { currentPlanName } = this.props;
    this.props.fetchParameters(currentPlanName);
  }

  handleUpdateParameters = (updatedValues, saveAndClose) => {
    const { currentPlanName, history, updateParameters } = this.props;
    updateParameters(
      currentPlanName,
      updatedValues,
      saveAndClose && history.push.bind(this, `/plans/${currentPlanName}`)
    );
  };

  renderRoleTabs() {
    const {
      currentPlanName,
      match: { params: urlParams },
      isFetchingParameters,
      rolesLoaded
    } = this.props;
    if (rolesLoaded && !isFetchingParameters) {
      return (
        <ul className="nav nav-tabs">
          <NavTab
            to={`/plans/${currentPlanName}/roles/${
              urlParams.roleName
            }/parameters`}
          >
            <FormattedMessage {...messages.parameters} />
          </NavTab>
          <NavTab
            to={`/plans/${currentPlanName}/roles/${
              urlParams.roleName
            }/services`}
          >
            <FormattedMessage {...messages.services} />
          </NavTab>
          <NavTab
            to={`/plans/${currentPlanName}/roles/${
              urlParams.roleName
            }/network-configuration`}
          >
            <FormattedMessage {...messages.networkConfiguration} />
          </NavTab>
        </ul>
      );
    }
  }

  render() {
    const {
      currentPlanName,
      intl: { formatMessage },
      isFetchingParameters,
      location,
      match: { params: urlParams },
      role,
      rolesLoaded
    } = this.props;
    const dataLoaded = rolesLoaded && !isFetchingParameters;
    const roleName = role ? role.name : null;
    return (
      <RoutedModalPanel redirectPath={`/plans/${currentPlanName}`}>
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage
              {...messages.role}
              values={{ roleName: roleName }}
            />
          </ModalTitle>
        </ModalHeader>
        <Loader
          height={60}
          content={formatMessage(messages.loadingParameters)}
          component="div"
          componentProps={{ className: 'flex-container' }}
          loaded={dataLoaded}
        >
          <ParametersForm updateParameters={this.handleUpdateParameters}>
            {this.renderRoleTabs()}
            <Switch location={location}>
              <Route
                path="/plans/:planName/roles/:roleName/parameters"
                component={RoleParameters}
              />
              <Route
                path="/plans/:planName/roles/:roleName/services"
                component={RoleServices}
              />
              <Route
                path="/plans/:planName/roles/:roleName/network-configuration"
                component={RoleNetworkConfig}
              />
              <Redirect
                from="/plans/:planName/roles/:roleName"
                to={`/plans/${currentPlanName}/roles/${
                  urlParams.roleName
                }/parameters`}
              />
            </Switch>
          </ParametersForm>
        </Loader>
      </RoutedModalPanel>
    );
  }
}
RoleDetail.propTypes = {
  currentPlanName: PropTypes.string,
  fetchParameters: PropTypes.func,
  history: PropTypes.object,
  intl: PropTypes.object,
  isFetchingParameters: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  role: ImmutablePropTypes.record,
  rolesLoaded: PropTypes.bool.isRequired,
  updateParameters: PropTypes.func
};

function mapStateToProps(state, props) {
  return {
    currentPlanName: getCurrentPlanName(state),
    isFetchingParameters: state.parameters.isFetching,
    role: getRole(state, props.match.params.roleName),
    rolesLoaded: state.roles.get('loaded')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchParameters: currentPlanName => {
      dispatch(
        fetchParameters(currentPlanName, () =>
          ownProps.history.push(`/plans/${currentPlanName}`)
        )
      );
    },
    updateParameters: (currentPlanName, data, redirectPath) => {
      dispatch(updateParameters(currentPlanName, data, redirectPath));
    }
  };
}

export default checkRunningDeployment(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(RoleDetail))
);
