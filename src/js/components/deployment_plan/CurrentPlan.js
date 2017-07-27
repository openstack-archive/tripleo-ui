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
import { Link, Route, withRouter } from 'react-router-dom';

import DeploymentConfiguration from './DeploymentConfiguration';
import DeploymentDetail from '../deployment/DeploymentDetail';
import { getAllPlansButCurrent } from '../../selectors/plans';
import {
  getCurrentStack,
  getCurrentStackDeploymentProgress,
  getCurrentStackDeploymentInProgress,
  getOvercloudInfo
} from '../../selectors/stacks';
import {
  getAvailableNodes,
  getAvailableNodesCountsByRole,
  getNodeCountParametersByRole,
  getTotalAssignedNodesCount
} from '../../selectors/nodesAssignment';
import {
  getEnvironmentConfigurationSummary
} from '../../selectors/environmentConfiguration';
import { getCurrentPlan } from '../../selectors/plans';
import { getRoles } from '../../selectors/roles';
import ConfigurePlanStep from './ConfigurePlanStep';
import CurrentPlanActions from '../../actions/CurrentPlanActions';
import { DeploymentPlanStep } from './DeploymentPlanStep';
import DeployStep from './DeployStep';
import EnvironmentConfigurationActions
  from '../../actions/EnvironmentConfigurationActions';
import HardwareStep from './HardwareStep';
import NodesActions from '../../actions/NodesActions';
import NotificationActions from '../../actions/NotificationActions';
import ParametersActions from '../../actions/ParametersActions';
import PlansActions from '../../actions/PlansActions';
import RoleDetail from '../roles/RoleDetail';
import RolesStep from './RolesStep';
import RolesActions from '../../actions/RolesActions';
import StacksActions from '../../actions/StacksActions';
import stackStates from '../../constants/StacksConstants';
import ValidationsActions from '../../actions/ValidationsActions';

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
    defaultMessage: 'This step registers and introspects your nodes. Registration involves ' +
      'defining the power management details of each node so that you so that the director can ' +
      'control them during the introspection and provisioning stages. After registration, you ' +
      'introspect the nodes, which identifies the hardware each node uses and builds a profile of ' +
      'each node. After registration and introspection, you can assign these nodes into specific ' +
      'roles in your overcloud.'
  },
  configurePlanStepTooltip: {
    id: 'CurrentPlan.configurePlanStepTooltip',
    defaultMessage: "This step allows you edit specific settings for the overcloud's network, " +
      'storage, and other certified plugins. Use this step to define your network isolation ' +
      'configuration and your backend storage settings.'
  },
  configureRolesStepTooltip: {
    id: 'CurrentPlan.configureRolesStepTooltip',
    defaultMessage: 'This step assigns and removes nodes from roles in your overcloud. On each ' +
      "role's selection dialog, you can tag available nodes into the role or untag nodes already " +
      'assigned to the role. Click "Assign Nodes" for a particular role to open the selection ' +
      'dialog and start assigning nodes. ' +
      'You can also customize role-specific settings in this step. For example, you can compose ' +
      'services on each role and customize specific parameters related to each role. Click the ' +
      'pencil icon in the top-right corner of each role to see these role-specific settings'
  },
  deployStepTooltip: {
    id: 'CurrentPlan.deploymentStepTooltip',
    defaultMessage: 'This step performs the deployment of the overcloud. Once the deployment ' +
      'begins, the director tracks the progress and provides a report of each completed, running, ' +
      'or failed step. When the deployment completes, the director displays the current overcloud ' +
      'status and login details, which you use to interact with your overcloud. Click "Deploy" to ' +
      'start the deployment.'
  }
});

class CurrentPlan extends React.Component {
  componentDidMount() {
    this.props.fetchStacks();
    this.fetchParameters();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.stacksLoaded) {
      this.props.fetchStacks();
    }
    if (nextProps.currentPlan !== this.props.currentPlan) {
      this.fetchParameters();
    }
    this.postDeploymentValidationsCheck(nextProps.currentStack);
    this.pollCurrentStack(nextProps.currentStack);
  }

  componentWillUnmount() {
    clearTimeout(this.stackProgressTimeout);
  }

  fetchParameters() {
    !this.props.isFetchingParameters &&
      this.props.fetchParameters(this.props.currentPlan.name);
  }

  pollCurrentStack(currentStack) {
    if (currentStack) {
      if (currentStack.stack_status.match(/PROGRESS/)) {
        clearTimeout(this.stackProgressTimeout);
        this.stackProgressTimeout = setTimeout(() => {
          this.props.fetchStacks();
          this.props.fetchStackResources(currentStack);
        }, 20000);
      }
    }
  }

  postDeploymentValidationsCheck(nextStack) {
    const { currentStack, currentPlan } = this.props;
    const progressStates = [
      stackStates.UPDATE_IN_PROGRESS,
      stackStates.CREATE_IN_PROGRESS
    ];
    const successStates = [
      stackStates.UPDATE_COMPLETE,
      stackStates.CREATE_COMPLETE
    ];
    if (
      currentStack &&
      nextStack &&
      progressStates.includes(currentStack.stack_status) &&
      successStates.includes(nextStack.stack_status)
    ) {
      this.props.runPostDeploymentValidations(currentPlan.name);
    }
  }

  render() {
    const { intl: { formatMessage }, currentPlan } = this.props;

    const currentPlanName = currentPlan.name;
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
            <h1>{currentPlanName}</h1>
          </div>
          <ol className="deployment-step-list">
            <DeploymentPlanStep
              title={formatMessage(messages.hardwareStepHeader)}
              disabled={this.props.currentStackDeploymentInProgress}
              tooltip={formatMessage(messages.hardwareStepTooltip)}
            >
              <HardwareStep />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.deploymentConfigurationStepHeader)}
              disabled={this.props.currentStackDeploymentInProgress}
              tooltip={formatMessage(messages.configurePlanStepTooltip)}
            >
              <ConfigurePlanStep
                fetchEnvironmentConfiguration={
                  this.props.fetchEnvironmentConfiguration
                }
                summary={this.props.environmentConfigurationSummary}
                planName={currentPlanName}
                isFetching={this.props.isFetchingEnvironmentConfiguration}
                loaded={this.props.environmentConfigurationLoaded}
              />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.configureRolesStepHeader)}
              disabled={this.props.currentStackDeploymentInProgress}
              tooltip={formatMessage(messages.configureRolesStepTooltip)}
            >
              <RolesStep
                availableNodesCount={this.props.availableNodes.size}
                availableNodesCountsByRole={
                  this.props.availableNodesCountsByRole
                }
                currentPlanName={currentPlanName}
                nodeCountParametersByRole={this.props.nodeCountParametersByRole}
                fetchNodes={this.props.fetchNodes}
                fetchRoles={this.props.fetchRoles.bind(this, currentPlanName)}
                isFetchingNodes={this.props.isFetchingNodes}
                isFetchingRoles={this.props.isFetchingRoles}
                isFetchingParameters={this.props.isFetchingParameters}
                roles={this.props.roles}
                rolesLoaded={this.props.rolesLoaded}
                totalAssignedNodesCount={this.props.totalAssignedNodesCount}
              />
            </DeploymentPlanStep>
            <DeploymentPlanStep
              title={formatMessage(messages.deployStepHeader)}
              tooltip={formatMessage(messages.deployStepTooltip)}
            >
              <DeployStep
                currentPlan={currentPlan}
                currentStack={this.props.currentStack}
                currentStackResources={this.props.currentStackResources}
                currentStackDeploymentProgress={
                  this.props.currentStackDeploymentProgress
                }
                deleteStack={this.props.deleteStack}
                deployPlan={this.props.deployPlan}
                fetchStackEnvironment={this.props.fetchStackEnvironment}
                fetchStackResource={this.props.fetchStackResource}
                overcloudInfo={this.props.overcloudInfo}
                isRequestingStackDelete={this.props.isRequestingStackDelete}
                stacksLoaded={this.props.stacksLoaded}
              />
            </DeploymentPlanStep>
          </ol>
        </div>
        <Route
          path="/plans/:planName/configuration"
          component={DeploymentConfiguration}
        />
        <Route
          path="/plans/:planName/roles/:roleIdentifier"
          component={RoleDetail}
        />
        <Route
          path="/plans/:planName/deployment-detail"
          component={DeploymentDetail}
        />
      </div>
    );
  }
}

CurrentPlan.propTypes = {
  availableNodes: ImmutablePropTypes.map,
  availableNodesCountsByRole: ImmutablePropTypes.map.isRequired,
  choosePlan: PropTypes.func,
  currentPlan: ImmutablePropTypes.record,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentInProgress: PropTypes.bool,
  currentStackDeploymentProgress: PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  deleteStack: PropTypes.func,
  deployPlan: PropTypes.func,
  environmentConfigurationLoaded: PropTypes.bool,
  environmentConfigurationSummary: PropTypes.string,
  fetchEnvironmentConfiguration: PropTypes.func,
  fetchNodes: PropTypes.func,
  fetchParameters: PropTypes.func,
  fetchRoles: PropTypes.func,
  fetchStackEnvironment: PropTypes.func,
  fetchStackResource: PropTypes.func,
  fetchStackResources: PropTypes.func.isRequired,
  fetchStacks: PropTypes.func,
  inactivePlans: ImmutablePropTypes.map,
  intl: PropTypes.object,
  isFetchingEnvironmentConfiguration: PropTypes.bool,
  isFetchingNodes: PropTypes.bool,
  isFetchingParameters: PropTypes.bool,
  isFetchingRoles: PropTypes.bool,
  isRequestingStackDelete: PropTypes.bool,
  nodeCountParametersByRole: ImmutablePropTypes.map,
  notify: PropTypes.func,
  overcloudInfo: ImmutablePropTypes.map.isRequired,
  roles: ImmutablePropTypes.map,
  rolesLoaded: PropTypes.bool,
  route: PropTypes.object,
  runPostDeploymentValidations: PropTypes.func.isRequired,
  stacksLoaded: PropTypes.bool.isRequired,
  totalAssignedNodesCount: PropTypes.number.isRequired
};

export function mapStateToProps(state, props) {
  return {
    availableNodesCountsByRole: getAvailableNodesCountsByRole(state),
    nodeCountParametersByRole: getNodeCountParametersByRole(state),
    availableNodes: getAvailableNodes(state),
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    currentStackResources: state.stacks.resources,
    currentStackDeploymentInProgress: getCurrentStackDeploymentInProgress(
      state
    ),
    currentStackDeploymentProgress: getCurrentStackDeploymentProgress(state),
    environmentConfigurationLoaded: state.environmentConfiguration.loaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    isFetchingEnvironmentConfiguration: state.environmentConfiguration
      .isFetching,
    isFetchingNodes: state.nodes.get('isFetching'),
    isFetchingParameters: state.parameters.isFetching,
    isFetchingRoles: state.roles.get('isFetching'),
    overcloudInfo: getOvercloudInfo(state),
    isRequestingStackDelete: state.stacks.get('isRequestingStackDelete'),
    inactivePlans: getAllPlansButCurrent(state),
    roles: getRoles(state),
    rolesLoaded: state.roles.get('loaded'),
    stacksLoaded: state.stacks.get('isLoaded'),
    totalAssignedNodesCount: getTotalAssignedNodesCount(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    choosePlan: planName => dispatch(CurrentPlanActions.choosePlan(planName)),
    deleteStack: (stackName, stackId) => {
      dispatch(StacksActions.deleteStack(stackName, stackId));
    },
    deployPlan: planName => dispatch(PlansActions.deployPlan(planName)),
    fetchStackEnvironment: stack =>
      dispatch(StacksActions.fetchEnvironment(stack)),
    fetchEnvironmentConfiguration: (planName, parentPath) => {
      dispatch(
        EnvironmentConfigurationActions.fetchEnvironmentConfiguration(
          planName,
          parentPath
        )
      );
    },
    fetchNodes: () => dispatch(NodesActions.fetchNodes()),
    fetchParameters: planName =>
      dispatch(ParametersActions.fetchParameters(planName)),
    fetchRoles: planName => dispatch(RolesActions.fetchRoles(planName)),
    fetchStackResources: stack =>
      dispatch(StacksActions.fetchResources(stack.stack_name, stack.id)),
    fetchStackResource: (stack, resourceName) =>
      dispatch(StacksActions.fetchResource(stack, resourceName)),
    fetchStacks: () => dispatch(StacksActions.fetchStacks()),
    notify: notification => dispatch(NotificationActions.notify(notification)),
    runPostDeploymentValidations: planName => {
      dispatch(
        ValidationsActions.runValidationGroups(['post-deployment'], planName)
      );
    }
  };
}

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(CurrentPlan))
);
