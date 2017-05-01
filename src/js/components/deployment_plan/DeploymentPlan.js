import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import { getAllPlansButCurrent } from '../../selectors/plans';
import {
  getCurrentStack,
  getCurrentStackDeploymentProgress,
  getCurrentStackDeploymentInProgress
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
import PlansDropdown from './PlansDropdown';
import NodesActions from '../../actions/NodesActions';
import NoPlans from './NoPlans';
import NotificationActions from '../../actions/NotificationActions';
import ParametersActions from '../../actions/ParametersActions';
import PlansActions from '../../actions/PlansActions';
import StacksActions from '../../actions/StacksActions';
import stackStates from '../../constants/StacksConstants';
import RolesStep from './RolesStep';
import RolesActions from '../../actions/RolesActions';
import ValidationsActions from '../../actions/ValidationsActions';

const messages = defineMessages({
  hardwareStepHeader: {
    id: 'DeploymentPlan.hardwareStepHeader',
    defaultMessage: 'Prepare Hardware'
  },
  configureRolesStepHeader: {
    id: 'DeploymentPlan.configureRolesStepHeader',
    defaultMessage: 'Configure Roles and Assign Nodes'
  },
  deploymentConfigurationStepHeader: {
    id: 'DeploymentPlan.deploymentConfigurationStepHeader',
    defaultMessage: 'Specify Deployment Configuration'
  },
  deployStepHeader: {
    id: 'DeploymentPlan.deployStepHeader',
    defaultMessage: 'Deploy'
  },
  hardwareStepTooltip: {
    id: 'DeploymentPlan.hardwareStepTooltip',
    defaultMessage: 'This step registers and introspects your nodes. Registration involves ' +
      'defining the power management details of each node so that you so that the director can ' +
      'control them during the introspection and provisioning stages. After registration, you ' +
      'introspect the nodes, which identifies the hardware each node uses and builds a profile of ' +
      'each node. After registration and introspection, you can assign these nodes into specific ' +
      'roles in your overcloud.'
  },
  configurePlanStepTooltip: {
    id: 'DeploymentPlan.configurePlanStepTooltip',
    defaultMessage: "This step allows you edit specific settings for the overcloud's network, " +
      'storage, and other certified plugins. Use this step to define your network isolation ' +
      'configuration and your backend storage settings.'
  },
  configureRolesStepTooltip: {
    id: 'DeploymentPlan.configureRolesStepTooltip',
    defaultMessage: 'This step assigns and removes nodes from roles in your overcloud. On each ' +
      "role's selection dialog, you can tag available nodes into the role or untag nodes already " +
      'assigned to the role. Click "Assign Nodes" for a particular role to open the selection ' +
      'dialog and start assigning nodes. ' +
      'You can also customize role-specific settings in this step. For example, you can compose ' +
      'services on each role and customize specific parameters related to each role. Click the ' +
      'pencil icon in the top-right corner of each role to see these role-specific settings'
  },
  deployStepTooltip: {
    id: 'DeploymentPlan.deploymentStepTooltip',
    defaultMessage: 'This step performs the deployment of the overcloud. Once the deployment ' +
      'begins, the director tracks the progress and provides a report of each completed, running, ' +
      'or failed step. When the deployment completes, the director displays the current overcloud ' +
      'status and login details, which you use to interact with your overcloud. Click "Deploy" to ' +
      'start the deployment.'
  }
});

class DeploymentPlan extends React.Component {
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
    const { formatMessage } = this.props.intl;
    let children;
    const currentPlanName = this.props.hasPlans
      ? this.props.currentPlan.name
      : undefined;

    // Render children only when current plan is already selected
    if (this.props.children && currentPlanName) {
      children = React.cloneElement(this.props.children, {
        currentPlanName: currentPlanName,
        parentPath: '/' + this.props.route.path
      });
    }

    return (
      <div className="row">
        {this.props.hasPlans
          ? <div className="col-sm-12">
              <div className="page-header page-header-bleed-right">
                <h1>
                  {currentPlanName}
                  <PlansDropdown
                    currentPlanName={currentPlanName}
                    plans={this.props.inactivePlans}
                    choosePlan={this.props.choosePlan}
                  />
                </h1>
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
                  title={formatMessage(
                    messages.deploymentConfigurationStepHeader
                  )}
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
                    nodeCountParametersByRole={
                      this.props.nodeCountParametersByRole
                    }
                    availableNodesCount={this.props.availableNodes.size}
                    availableNodesCountsByRole={
                      this.props.availableNodesCountsByRole
                    }
                    fetchNodes={this.props.fetchNodes}
                    fetchRoles={this.props.fetchRoles.bind(
                      this,
                      currentPlanName
                    )}
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
                    currentPlan={this.props.currentPlan}
                    currentStack={this.props.currentStack}
                    currentStackResources={this.props.currentStackResources}
                    currentStackResourcesLoaded={
                      this.props.currentStackResourcesLoaded
                    }
                    currentStackDeploymentProgress={
                      this.props.currentStackDeploymentProgress
                    }
                    deleteStack={this.props.deleteStack}
                    deployPlan={this.props.deployPlan}
                    fetchStackEnvironment={this.props.fetchStackEnvironment}
                    fetchStackResource={this.props.fetchStackResource}
                    isRequestingStackDelete={this.props.isRequestingStackDelete}
                    stacksLoaded={this.props.stacksLoaded}
                  />
                </DeploymentPlanStep>
              </ol>
            </div>
          : <div className="col-sm-12">
              <NoPlans />
            </div>}
        {children}
      </div>
    );
  }
}

DeploymentPlan.propTypes = {
  availableNodes: ImmutablePropTypes.map,
  availableNodesCountsByRole: ImmutablePropTypes.map.isRequired,
  children: PropTypes.node,
  choosePlan: PropTypes.func,
  currentPlan: ImmutablePropTypes.record,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentInProgress: PropTypes.bool,
  currentStackDeploymentProgress: PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  currentStackResourcesLoaded: PropTypes.bool.isRequired,
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
  hasPlans: PropTypes.bool,
  inactivePlans: ImmutablePropTypes.map,
  intl: PropTypes.object,
  isFetchingEnvironmentConfiguration: PropTypes.bool,
  isFetchingNodes: PropTypes.bool,
  isFetchingParameters: PropTypes.bool,
  isFetchingRoles: PropTypes.bool,
  isRequestingStackDelete: PropTypes.bool,
  nodeCountParametersByRole: ImmutablePropTypes.map,
  notify: PropTypes.func,
  roles: ImmutablePropTypes.map,
  rolesLoaded: PropTypes.bool,
  route: PropTypes.object,
  runPostDeploymentValidations: PropTypes.func.isRequired,
  stacksLoaded: PropTypes.bool.isRequired,
  totalAssignedNodesCount: PropTypes.number.isRequired
};

export function mapStateToProps(state) {
  return {
    availableNodesCountsByRole: getAvailableNodesCountsByRole(state),
    nodeCountParametersByRole: getNodeCountParametersByRole(state),
    availableNodes: getAvailableNodes(state),
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    currentStackResources: state.stacks.resources,
    currentStackResourcesLoaded: state.stacks.resourcesLoaded,
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
    isRequestingStackDelete: state.stacks.get('isRequestingStackDelete'),
    hasPlans: !state.plans.get('all').isEmpty(),
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
  connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan)
);
