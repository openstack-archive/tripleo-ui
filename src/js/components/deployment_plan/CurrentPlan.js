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
import PropTypes from 'prop-types';
import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';

import Breadcrumbs from '../ui/Breadcrumbs';
import DeploymentConfiguration from './DeploymentConfiguration';
import DeploymentConfirmationRoute from './DeploymentConfirmationRoute';
import DeploymentDetailRoute from './DeploymentDetailRoute';
import {
  getCurrentPlanDeploymentStatus,
  getCurrentPlanDeploymentStatusUI,
  getCurrentPlanDeploymentIsInProgress
} from '../../selectors/deployment';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import { getContainerImagePrepareParameterSeed } from '../../selectors/parameters';
import { getCurrentPlan } from '../../selectors/plans';
import { getDeploymentStatus } from '../../actions/DeploymentActions';
import ConfigurePlanStep from './ConfigurePlanStep';
import ConfigureNetworkStep from './ConfigureNetworkStep';
import ConfigureContainerImagesStep from './ConfigureContainerImagesStep';
import { DeploymentPlanStep } from './DeploymentPlanStep';
import DeployStep from './DeployStep';
import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import HardwareStep from './HardwareStep';
import { Loader } from '../ui/Loader';
import NetworkConfiguration from '../networkConfiguration/NetworkConfiguration';
import ParametersActions from '../../actions/ParametersActions';
import ContainerImagesWizard from '../containerImages/ContainerImagesWizard';
import RoleDetail from '../roles/RoleDetail';
import RolesStep from './RolesStep';

const messages = defineMessages({
  backToAllPlans: {
    id: 'CurrentPlan.backToAllPlans',
    defaultMessage: 'All Plans'
  },
  hardwareStepHeader: {
    id: 'CurrentPlan.hardwareStepHeader',
    defaultMessage: 'Prepare Hardware'
  },
  configureRolesStepHeader: {
    id: 'CurrentPlan.configureRolesStepHeader',
    defaultMessage: 'Configure Roles and Assign Nodes'
  },
  deploymentConfigurationStepHeader: {
    id: 'CurrentPlan.deploymentConfigurationStepHeader',
    defaultMessage: 'Specify Deployment Configuration'
  },
  configureNetworkStepHeader: {
    id: 'CurrentPlan.configureNetworkStepHeader',
    defaultMessage: 'Configure Network'
  },
  configureContainerImagesStepHeader: {
    id: 'CurrentPlan.configureContainerImagesStepHeader',
    defaultMessage: 'Prepare Container Images'
  },
  configureContainerImagesStepTooltip: {
    id: 'CurrentPlan.configureContainerImagesStepTooltip',
    defaultMessage:
      'Container images need to be pulled from an image registry which is reliably \
      available to overcloud nodes. The three common options to serve images are \
      to use the default registry, the registry available on the undercloud, or an \
      independently managed registry. Use this step to configure where to pull images \
      from, which local repository to push images to and how to discover the last \
      versioned tag for each image.'
  },
  deployStepHeader: {
    id: 'CurrentPlan.deployStepHeader',
    defaultMessage: 'Deploy'
  },
  hardwareStepTooltip: {
    id: 'CurrentPlan.hardwareStepTooltip',
    defaultMessage:
      'Registration of hardware involves defining the power management details of each node ' +
      'so that the application can control them during introspection and provisioning. ' +
      'Introspection identifies the hardware each node uses and builds a profile of each node.'
  },
  configurePlanStepTooltip: {
    id: 'CurrentPlan.configurePlanStepTooltip',
    defaultMessage:
      "This step allows you to edit specific settings for the overcloud's network, " +
      'storage, and other certified plugins. Use this step to define your network isolation ' +
      'configuration and your backend storage settings.'
  },
  configureRolesStepTooltip: {
    id: 'CurrentPlan.configureRolesStepTooltip',
    defaultMessage:
      "On each role's selection dialog, you can assign available nodes into the role or " +
      'unassign nodes already assigned to the role. You can also customize role-specific ' +
      'settings in this step. Click the icon in the top-right corner of each role to ' +
      'see these role-specific settings.'
  },
  configureNetworkStepTooltip: {
    id: 'CurrentPlan.configureNetworkStepTooltip',
    defaultMessage:
      'This step lets user manage deployment networks, assign them to deployment roles, ' +
      'and configure network interfaces.'
  },
  deployStepTooltip: {
    id: 'CurrentPlan.deploymentStepTooltip',
    defaultMessage:
      'This step starts the deployment of the overcloud. Once the deployment begins, you can ' +
      'track the progress and see a report of each completed, running, or failed step.'
  },
  loadingDeploymentStatus: {
    id: 'CurrentPlan.loadingDeploymentStatus',
    defaultMessage: 'Loading Deployment Status'
  }
});

class CurrentPlan extends React.Component {
  componentDidMount() {
    this.props.getDeploymentStatus(this.props.currentPlan.name);
    this.fetchParameters();
  }

  fetchParameters() {
    !this.props.isFetchingParameters &&
      this.props.fetchParameters(this.props.currentPlan.name);
  }

  render() {
    const {
      intl: { formatMessage },
      containerImagePrepareParameterSeed,
      currentPlan,
      deploymentInProgress,
      deploymentStatus,
      deploymentStatusLoaded,
      environmentConfigurationSummary,
      environmentConfigurationLoaded,
      isFetchingEnvironmentConfiguration,
      isFetchingParameters,
      fetchEnvironmentConfiguration
    } = this.props;

    const currentPlanName = currentPlan.name;
    const disableDeploymentSteps =
      deploymentInProgress || !deploymentStatusLoaded;
    return (
      <div className="row">
        <div className="col-sm-12">
          <Breadcrumbs>
            <li>
              <Link to="/plans/manage" id="CurrentPlan__allPlans">
                <FormattedMessage {...messages.backToAllPlans} />
              </Link>
            </li>
            <li className="active" id="CurrentPlan__breadcrumb">
              {currentPlanName}
            </li>
          </Breadcrumbs>
          <ol className="deployment-step-list">
            <DeploymentPlanStep
              title={formatMessage(messages.hardwareStepHeader)}
              disabled={disableDeploymentSteps}
              tooltip={formatMessage(messages.hardwareStepTooltip)}
            >
              <HardwareStep />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.deploymentConfigurationStepHeader)}
              disabled={disableDeploymentSteps}
              tooltip={formatMessage(messages.configurePlanStepTooltip)}
            >
              <ConfigurePlanStep
                fetchEnvironmentConfiguration={fetchEnvironmentConfiguration}
                summary={environmentConfigurationSummary}
                planName={currentPlanName}
                isFetching={isFetchingEnvironmentConfiguration}
                loaded={environmentConfigurationLoaded}
              />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.configureRolesStepHeader)}
              disabled={disableDeploymentSteps}
              tooltip={formatMessage(messages.configureRolesStepTooltip)}
            >
              <RolesStep />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.configureNetworkStepHeader)}
              disabled={disableDeploymentSteps}
              tooltip={formatMessage(messages.configureNetworkStepTooltip)}
            >
              <ConfigureNetworkStep planName={currentPlanName} />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.configureContainerImagesStepHeader)}
              disabled={disableDeploymentSteps}
              tooltip={formatMessage(
                messages.configureContainerImagesStepTooltip
              )}
            >
              <ConfigureContainerImagesStep
                planName={currentPlanName}
                isFetchingParameters={isFetchingParameters}
                containerImagePrepareParameterSeed={
                  containerImagePrepareParameterSeed
                }
              />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.deployStepHeader)}
              tooltip={formatMessage(messages.deployStepTooltip)}
            >
              <Loader
                loaded={deploymentStatusLoaded}
                content={formatMessage(messages.loadingDeploymentStatus)}
              >
                <DeployStep currentPlan={currentPlan} />
              </Loader>
            </DeploymentPlanStep>
          </ol>
        </div>
        {deploymentStatusLoaded && (
          <Switch>
            <Route
              path="/plans/:planName/configuration"
              component={DeploymentConfiguration}
            />
            <Route
              path="/plans/:planName/roles/:roleName"
              component={RoleDetail}
            />
            <Route
              path="/plans/:planName/network-configuration"
              component={NetworkConfiguration}
            />
            <Route
              path="/plans/:planName/container-images"
              component={ContainerImagesWizard}
            />
            <Route
              path="/plans/:planName/deployment-confirmation"
              render={() => (
                <DeploymentConfirmationRoute
                  deploymentStatus={deploymentStatus.status}
                  currentPlanName={currentPlan.name}
                />
              )}
            />
            <Route
              path="/plans/:planName/deployment-detail"
              render={() => (
                <DeploymentDetailRoute
                  deploymentStatus={deploymentStatus.status}
                  currentPlanName={currentPlan.name}
                />
              )}
            />
          </Switch>
        )}
      </div>
    );
  }
}

CurrentPlan.propTypes = {
  containerImagePrepareParameterSeed: PropTypes.object.isRequired,
  currentPlan: ImmutablePropTypes.record,
  deploymentInProgress: PropTypes.bool.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  deploymentStatusLoaded: PropTypes.bool,
  environmentConfigurationLoaded: PropTypes.bool,
  environmentConfigurationSummary: PropTypes.string,
  fetchEnvironmentConfiguration: PropTypes.func,
  fetchParameters: PropTypes.func,
  getDeploymentStatus: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingEnvironmentConfiguration: PropTypes.bool.isRequired,
  isFetchingParameters: PropTypes.bool.isRequired
};

export function mapStateToProps(state, props) {
  return {
    currentPlan: getCurrentPlan(state),
    deploymentInProgress: getCurrentPlanDeploymentIsInProgress(state),
    deploymentStatus: getCurrentPlanDeploymentStatus(state),
    deploymentStatusLoaded: getCurrentPlanDeploymentStatusUI(state).isLoaded,
    environmentConfigurationLoaded: state.environmentConfiguration.loaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    isFetchingEnvironmentConfiguration:
      state.environmentConfiguration.isFetching,
    isFetchingParameters: state.parameters.isFetching,
    containerImagePrepareParameterSeed: getContainerImagePrepareParameterSeed(
      state
    )
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDeploymentStatus: planName => dispatch(getDeploymentStatus(planName)),
    fetchEnvironmentConfiguration: (planName, parentPath) => {
      dispatch(
        EnvironmentConfigurationActions.fetchEnvironmentConfiguration(
          planName,
          parentPath
        )
      );
    },
    fetchParameters: planName =>
      dispatch(ParametersActions.fetchParameters(planName))
  };
}

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(CurrentPlan))
);
