import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { getAllPlansButCurrent } from '../../selectors/plans';
import { getCurrentStack,
         getCurrentStackDeploymentProgress,
         getCurrentStackDeploymentInProgress,
         getOvercloudInfo } from '../../selectors/stacks';
import { getAvailableNodesByRole, getUnassignedAvailableNodes } from '../../selectors/nodes';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import { getCurrentPlan } from '../../selectors/plans';
import { getRoles } from '../../selectors/roles';
import ConfigurePlanStep from './ConfigurePlanStep';
import CurrentPlanActions from '../../actions/CurrentPlanActions';
import { DeploymentPlanStep } from './DeploymentPlanStep';
import DeployStep from './DeployStep';
import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import HardwareStep from './HardwareStep';
import PlansDropdown from './PlansDropdown';
import NodesActions from '../../actions/NodesActions';
import NoPlans from './NoPlans';
import NotificationActions from '../../actions/NotificationActions';
import PlanActions from '../../actions/PlansActions';
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
  }
});

class DeploymentPlan extends React.Component {
  componentDidMount() {
    this.props.fetchStacks();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.stacksLoaded) { this.props.fetchStacks(); }
    this.postDeploymentValidationsCheck(nextProps.currentStack);
    this.pollCurrentStack(nextProps.currentStack);
  }

  componentWillUnmount() {
    clearTimeout(this.stackProgressTimeout);
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
    const progressStates = [stackStates.UPDATE_IN_PROGRESS, stackStates.CREATE_IN_PROGRESS];
    const successStates = [stackStates.UPDATE_COMPLETE, stackStates.CREATE_COMPLETE];
    if (currentStack
        && nextStack
        && progressStates.includes(currentStack.stack_status)
        && successStates.includes(nextStack.stack_status)) {
      this.props.runPostDeploymentValidations(currentPlan.name);
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    let children;
    const currentPlanName = this.props.hasPlans ? this.props.currentPlan.name : undefined;

    // Render children only when current plan is already selected
    if (this.props.children && currentPlanName) {
      children = React.cloneElement(this.props.children,
                                    {currentPlanName: currentPlanName,
                                     parentPath: '/' + this.props.route.path});
    }

    return (
      <div className="row">
        {this.props.hasPlans ? (
          <div className="col-sm-12">
            <div className="page-header page-header-bleed-right">
              <h1>
                {currentPlanName}
                <PlansDropdown currentPlanName={currentPlanName}
                               plans={this.props.inactivePlans}
                               choosePlan={this.props.choosePlan}/>
              </h1>
            </div>
            <ol className="deployment-step-list">
            <DeploymentPlanStep title={formatMessage(messages.hardwareStepHeader)}
                                disabled={this.props.currentStackDeploymentInProgress}>
              <HardwareStep />
            </DeploymentPlanStep>
            <DeploymentPlanStep title={formatMessage(messages.deploymentConfigurationStepHeader)}
                                disabled={this.props.currentStackDeploymentInProgress}>
                <ConfigurePlanStep
                  fetchEnvironmentConfiguration={this.props.fetchEnvironmentConfiguration}
                  summary={this.props.environmentConfigurationSummary}
                  planName={currentPlanName}
                  isFetching={this.props.isFetchingEnvironmentConfiguration}
                  loaded={this.props.environmentConfigurationLoaded}/>
            </DeploymentPlanStep>
            <DeploymentPlanStep title={formatMessage(messages.configureRolesStepHeader)}
                                disabled={this.props.currentStackDeploymentInProgress}>
                <RolesStep availableNodesByRole={this.props.availableNodesByRole}
                           fetchNodes={this.props.fetchNodes}
                           fetchRoles={this.props.fetchRoles.bind(this, currentPlanName)}
                           isFetchingNodes={this.props.isFetchingNodes}
                           isFetchingRoles={this.props.isFetchingRoles}
                           roles={this.props.roles}
                           rolesLoaded={this.props.rolesLoaded}
                           unassignedAvailableNodes={this.props.unassignedAvailableNodes}/>
              </DeploymentPlanStep>
            <DeploymentPlanStep title={formatMessage(messages.deployStepHeader)}>
                <DeployStep
                  currentPlan={this.props.currentPlan}
                  currentStack={this.props.currentStack}
                  currentStackResources={this.props.currentStackResources}
                  currentStackDeploymentProgress={this.props.currentStackDeploymentProgress}
                  deleteStack={this.props.deleteStack}
                  deployPlan={this.props.deployPlan}
                  fetchStackEnvironment={this.props.fetchStackEnvironment}
                  fetchStackResource={this.props.fetchStackResource}
                  overcloudInfo={this.props.overcloudInfo}
                  isRequestingStackDelete={this.props.isRequestingStackDelete}
                  stacksLoaded={this.props.stacksLoaded}/>
              </DeploymentPlanStep>
            </ol>
          </div>
        ) : (
          <div className="col-sm-12">
            <NoPlans/>
          </div>
        )}
        {children}
      </div>
    );
  }
}

DeploymentPlan.propTypes = {
  availableNodesByRole: ImmutablePropTypes.map,
  children: React.PropTypes.node,
  choosePlan: React.PropTypes.func,
  currentPlan: ImmutablePropTypes.record,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentInProgress: React.PropTypes.bool,
  currentStackDeploymentProgress: React.PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  deleteStack: React.PropTypes.func,
  deployPlan: React.PropTypes.func,
  environmentConfigurationLoaded: React.PropTypes.bool,
  environmentConfigurationSummary: React.PropTypes.string,
  fetchEnvironmentConfiguration: React.PropTypes.func,
  fetchNodes: React.PropTypes.func,
  fetchRoles: React.PropTypes.func,
  fetchStackEnvironment: React.PropTypes.func,
  fetchStackResource: React.PropTypes.func,
  fetchStackResources: React.PropTypes.func.isRequired,
  fetchStacks: React.PropTypes.func,
  hasPlans: React.PropTypes.bool,
  inactivePlans: ImmutablePropTypes.map,
  intl: React.PropTypes.object,
  isFetchingEnvironmentConfiguration: React.PropTypes.bool,
  isFetchingNodes: React.PropTypes.bool,
  isFetchingRoles: React.PropTypes.bool,
  isRequestingStackDelete: React.PropTypes.bool,
  notify: React.PropTypes.func,
  overcloudInfo: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    ImmutablePropTypes.map
  ]).isRequired,
  roles: ImmutablePropTypes.map,
  rolesLoaded: React.PropTypes.bool,
  route: React.PropTypes.object,
  runPostDeploymentValidations: React.PropTypes.func.isRequired,
  stacksLoaded: React.PropTypes.bool.isRequired,
  unassignedAvailableNodes: ImmutablePropTypes.map
};

export function mapStateToProps(state) {
  return {
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    currentStackResources: state.stacks.resources,
    currentStackDeploymentInProgress: getCurrentStackDeploymentInProgress(state),
    currentStackDeploymentProgress: getCurrentStackDeploymentProgress(state),
    environmentConfigurationLoaded: state.environmentConfiguration.loaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    isFetchingEnvironmentConfiguration: state.environmentConfiguration.isFetching,
    isFetchingNodes: state.nodes.get('isFetching'),
    isFetchingRoles: state.roles.get('isFetching'),
    overcloudInfo: getOvercloudInfo(state),
    isRequestingStackDelete: state.stacks.get('isRequestingStackDelete'),
    hasPlans: !state.plans.get('all').isEmpty(),
    inactivePlans: getAllPlansButCurrent(state),
    availableNodesByRole: getAvailableNodesByRole(state),
    roles: getRoles(state),
    rolesLoaded: state.roles.get('loaded'),
    stacksLoaded: state.stacks.get('isLoaded'),
    unassignedAvailableNodes: getUnassignedAvailableNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    choosePlan: planName => dispatch(CurrentPlanActions.choosePlan(planName)),
    deleteStack: (stackName, stackId) => {
      dispatch(StacksActions.deleteStack(stackName, stackId));
    },
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName)),
    fetchStackEnvironment: (stack) => dispatch(StacksActions.fetchEnvironment(stack)),
    fetchEnvironmentConfiguration: (planName, parentPath) => {
      dispatch(EnvironmentConfigurationActions.fetchEnvironmentConfiguration(planName, parentPath));
    },
    fetchNodes: () => dispatch(NodesActions.fetchNodes()),
    fetchRoles: planName => dispatch(RolesActions.fetchRoles(planName)),
    fetchStackResources: (stack) =>
      dispatch(StacksActions.fetchResources(stack.stack_name, stack.id)),
    fetchStackResource: (stack, resourceName) =>
      dispatch(StacksActions.fetchResource(stack, resourceName)),
    fetchStacks: () => dispatch(StacksActions.fetchStacks()),
    notify: notification => dispatch(NotificationActions.notify(notification)),
    runPostDeploymentValidations: planName => {
      dispatch(ValidationsActions.runValidationGroups(['post-deployment'], planName));
    }
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan));
