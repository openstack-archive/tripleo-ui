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

import DeploymentConfiguration from './DeploymentConfiguration';
import DeploymentDetail from '../deployment/DeploymentDetail';
import {
  getCurrentPlanDeploymentStatus,
  getCurrentPlanDeploymentStatusLoaded
} from '../../selectors/deployment';
// import {
//   getCurrentStack,
//   getCurrentStackDeploymentProgress,
//   getOvercloudInfo
// } from '../../selectors/stacks';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import { getCurrentPlan } from '../../selectors/plans';
import { getDeploymentStatus } from '../../actions/DeploymentActions';
import ConfigurePlanStep from './ConfigurePlanStep';
import { DeploymentPlanStep } from './DeploymentPlanStep';
import DeployStep from './DeployStep';
import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import HardwareStep from './HardwareStep';
import { Loader } from '../ui/Loader';
import ParametersActions from '../../actions/ParametersActions';
// import PlansActions from '../../actions/PlansActions';
import RoleDetail from '../roles/RoleDetail';
import RolesStep from './RolesStep';
// import StacksActions from '../../actions/StacksActions';
// import stackStates from '../../constants/StacksConstants';
// import ValidationsActions from '../../actions/ValidationsActions';

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
    // this.props.fetchStacks();
    this.props.getDeploymentStatus(this.props.currentPlan.name);
    this.fetchParameters();
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.currentPlan !== this.props.currentPlan) {
  //     this.props.fetchStacks();
  //     this.fetchParameters();
  //     this.props.fetchStacks();
  //   }
  //   this.postDeploymentValidationsCheck(nextProps.currentStack);
  //   this.pollCurrentStack(nextProps.currentStack);
  // }

  // componentWillUnmount() {
  //   clearTimeout(this.stackProgressTimeout);
  // }

  fetchParameters() {
    !this.props.isFetchingParameters &&
      this.props.fetchParameters(this.props.currentPlan.name);
  }

  // pollCurrentStack(currentStack) {
  //   if (currentStack) {
  //     if (currentStack.stack_status.match(/PROGRESS/)) {
  //       clearTimeout(this.stackProgressTimeout);
  //       this.stackProgressTimeout = setTimeout(() => {
  //         this.props.fetchStacks();
  //         this.props.fetchStackResources(currentStack);
  //       }, 20000);
  //     }
  //   }
  // }

  // postDeploymentValidationsCheck(nextStack) {
  //   const { currentStack, currentPlan } = this.props;
  //   const progressStates = [
  //     stackStates.UPDATE_IN_PROGRESS,
  //     stackStates.CREATE_IN_PROGRESS
  //   ];
  //   const successStates = [
  //     stackStates.UPDATE_COMPLETE,
  //     stackStates.CREATE_COMPLETE
  //   ];
  //   if (
  //     currentStack &&
  //     nextStack &&
  //     progressStates.includes(currentStack.stack_status) &&
  //     successStates.includes(nextStack.stack_status)
  //   ) {
  //     this.props.runPostDeploymentValidations(currentPlan.name);
  //   }
  // }

  render() {
    const {
      intl: { formatMessage },
      currentPlan,
      deploymentStatus,
      deploymentStatusLoaded,
      // currentStackDeploymentProgress,
      environmentConfigurationSummary,
      environmentConfigurationLoaded,
      isFetchingEnvironmentConfiguration,
      // currentStack,
      // currentStackResources,
      // deleteStack,
      // deployPlan,
      // fetchStackEnvironment,
      fetchEnvironmentConfiguration
      // fetchStackResource,
      // overcloudInfo,
      // isRequestingStackDelete,
      // stacksLoaded
    } = this.props;

    const currentPlanName = currentPlan.name;
    const disableDeploymentSteps = ['DEPLOYING', 'UNDEPLOYING'].includes(
      deploymentStatus.status || deploymentStatusLoaded
    );
    return (
      <div className="row">
        <div className="col-sm-12">
          <ol className="breadcrumb">
            <li>
              <Link to="/plans/manage" id="CurrentPlan__allPlans">
                <FormattedMessage {...messages.backToAllPlans} />
              </Link>
            </li>
            <li className="active" id="CurrentPlan__breadcrumb">
              {currentPlanName}
            </li>
          </ol>
          <div className="page-header page-header-bleed-right">
            <h1 id="CurrentPlan__planName">{currentPlanName}</h1>
          </div>
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
              title={formatMessage(messages.deployStepHeader)}
              tooltip={formatMessage(messages.deployStepTooltip)}
            >
              <Loader
                loaded={deploymentStatusLoaded}
                content={formatMessage(messages.loadingDeploymentStatus)}
              >
                <DeployStep
                  currentPlan={currentPlan}
                  deploymentStatus={deploymentStatus}
                  // currentStack={currentStack}
                  // currentStackResources={currentStackResources}
                  // currentStackDeploymentProgress={currentStackDeploymentProgress}
                  // deleteStack={deleteStack}
                  // deployPlan={deployPlan}
                  // fetchStackEnvironment={fetchStackEnvironment}
                  // fetchStackResource={fetchStackResource}
                  // overcloudInfo={overcloudInfo}
                  // isRequestingStackDelete={isRequestingStackDelete}
                  // stacksLoaded={stacksLoaded}
                />
              </Loader>
            </DeploymentPlanStep>
          </ol>
        </div>
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
            path="/plans/:planName/deployment-detail"
            component={DeploymentDetail}
          />
        </Switch>
      </div>
    );
  }
}

CurrentPlan.propTypes = {
  currentPlan: ImmutablePropTypes.record,
  deploymentStatus: PropTypes.object,
  deploymentStatusLoaded: PropTypes.bool.isRequired,
  // currentStack: ImmutablePropTypes.record,
  // currentStackDeploymentProgress: PropTypes.number.isRequired,
  // currentStackResources: ImmutablePropTypes.map,
  // deleteStack: PropTypes.func,
  // deployPlan: PropTypes.func,
  environmentConfigurationLoaded: PropTypes.bool,
  environmentConfigurationSummary: PropTypes.string,
  fetchEnvironmentConfiguration: PropTypes.func,
  fetchParameters: PropTypes.func,
  // fetchStackEnvironment: PropTypes.func,
  // fetchStackResource: PropTypes.func,
  // fetchStackResources: PropTypes.func.isRequired,
  // fetchStacks: PropTypes.func,
  getDeploymentStatus: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingEnvironmentConfiguration: PropTypes.bool,
  isFetchingParameters: PropTypes.bool
  // isRequestingStackDelete: PropTypes.bool,
  // overcloudInfo: ImmutablePropTypes.map.isRequired,
  // runPostDeploymentValidations: PropTypes.func.isRequired,
  // stacksLoaded: PropTypes.bool.isRequired
};

export function mapStateToProps(state, props) {
  return {
    currentPlan: getCurrentPlan(state),
    deploymentStatus: getCurrentPlanDeploymentStatus(state),
    deploymentStatusLoaded: getCurrentPlanDeploymentStatusLoaded(state),
    // currentStack: getCurrentStack(state),
    // currentStackResources: state.stacks.resources,
    // currentStackDeploymentProgress: getCurrentStackDeploymentProgress(state),
    environmentConfigurationLoaded: state.environmentConfiguration.loaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    isFetchingEnvironmentConfiguration:
      state.environmentConfiguration.isFetching,
    isFetchingParameters: state.parameters.isFetching
    // overcloudInfo: getOvercloudInfo(state),
    // isRequestingStackDelete: state.stacks.get('isRequestingStackDelete'),
    // stacksLoaded: state.stacks.get('isLoaded')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDeploymentStatus: planName => dispatch(getDeploymentStatus(planName)),
    // deleteStack: (stackName, stackId) => {
    //   dispatch(StacksActions.deleteStack(stackName, stackId));
    // },
    // deployPlan: planName => dispatch(PlansActions.deployPlan(planName)),
    // fetchStackEnvironment: stack =>
    //   dispatch(StacksActions.fetchEnvironment(stack)),
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
    // fetchStackResources: stack =>
    //   dispatch(StacksActions.fetchResources(stack.stack_name, stack.id)),
    // fetchStackResource: (stack, resourceName) =>
    //   dispatch(StacksActions.fetchResource(stack, resourceName)),
    // fetchStacks: () => dispatch(StacksActions.fetchStacks()),
    // runPostDeploymentValidations: planName => {
    //   dispatch(
    //     ValidationsActions.runValidationGroups(['post-deployment'], planName)
    //   );
    // }
  };
}

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(CurrentPlan))
);
