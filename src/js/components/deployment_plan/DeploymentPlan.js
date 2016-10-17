import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { getAllPlansButCurrent } from '../../selectors/plans';
import { getCurrentStack,
         getCurrentStackDeploymentProgress,
         getCurrentStackDeploymentInProgress } from '../../selectors/stacks';
import { getAvailableNodes, getUnassignedAvailableNodes } from '../../selectors/nodes';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import { getCurrentPlan } from '../../selectors/plans';
import { ConfigurePlanStep } from './ConfigurePlanStep';
import CurrentPlanActions from '../../actions/CurrentPlanActions';
import { DeploymentPlanStep } from './DeploymentPlanStep';
import { DeployStep } from './DeployStep';
import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import { HardwareStep } from './HardwareStep';
import PlansDropdown from './PlansDropdown';
import NodesActions from '../../actions/NodesActions';
import NoPlans from './NoPlans';
import NotificationActions from '../../actions/NotificationActions';
import PlanActions from '../../actions/PlansActions';
import StacksActions from '../../actions/StacksActions';
import { RolesStep } from './RolesStep';
import RolesActions from '../../actions/RolesActions';
import ValidationsActions from '../../actions/ValidationsActions';

class DeploymentPlan extends React.Component {
  componentDidMount() {
    this.props.fetchStacks();
  }

  componentWillReceiveProps(nextProps) {
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

  render() {
    let children;
    // Render children only when current plan is already selected
    if (this.props.children && this.props.currentPlan.name) {
      children = React.cloneElement(this.props.children,
                                    {currentPlanName: this.props.currentPlan.name,
                                     parentPath: '/' + this.props.route.path});
    }

    return (
      <div className="row">
        {this.props.hasPlans ? (
          <div className="col-sm-12">
            <div className="page-header page-header-bleed-right">
              <h1>
                {this.props.currentPlan.name}
                <PlansDropdown currentPlanName={this.props.currentPlan.name}
                               plans={this.props.inactivePlans}
                               choosePlan={this.props.choosePlan}/>
              </h1>
            </div>
            <ol className="deployment-step-list">
              <DeploymentPlanStep title="Prepare Hardware"
                                  disabled={this.props.currentStackDeploymentInProgress}>
                <HardwareStep />
              </DeploymentPlanStep>
              <DeploymentPlanStep title="Specify Deployment Configuration"
                                  disabled={this.props.currentStackDeploymentInProgress}>
                <ConfigurePlanStep
                  fetchEnvironmentConfiguration={this.props.fetchEnvironmentConfiguration}
                  summary={this.props.environmentConfigurationSummary}
                  planName={this.props.currentPlan.name}
                  isFetching={this.props.isFetchingEnvironmentConfiguration}
                  loaded={this.props.environmentConfigurationLoaded}/>
              </DeploymentPlanStep>
              <DeploymentPlanStep title="Configure Roles and Assign Nodes"
                                  disabled={this.props.currentStackDeploymentInProgress}>
                <RolesStep availableNodes={this.props.availableNodes}
                           fetchNodes={this.props.fetchNodes}
                           fetchRoles={this.props.fetchRoles}
                           isFetchingNodes={this.props.isFetchingNodes}
                           isFetchingRoles={this.props.isFetchingRoles}
                           roles={this.props.roles}
                           rolesLoaded={this.props.rolesLoaded}
                           unassignedAvailableNodes={this.props.unassignedAvailableNodes}/>
              </DeploymentPlanStep>
              <DeploymentPlanStep title="Deploy">
                <DeployStep
                  currentPlan={this.props.currentPlan}
                  currentStack={this.props.currentStack}
                  currentStackResources={this.props.currentStackResources}
                  currentStackResourcesLoaded={this.props.currentStackResourcesLoaded}
                  currentStackDeploymentProgress={this.props.currentStackDeploymentProgress}
                  deployPlan={this.props.deployPlan}
                  fetchStackEnvironment={this.props.fetchStackEnvironment}
                  fetchStackResource={this.props.fetchStackResource}
                  isRequestingDelete={this.props.isRequestingDelete}
                  runPostDeploymentValidations={
                    this.props.runPostDeploymentValidations.bind(this.props.currentPlan.name)}
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
  availableNodes: ImmutablePropTypes.map,
  children: React.PropTypes.node,
  choosePlan: React.PropTypes.func,
  currentPlan: ImmutablePropTypes.record,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentInProgress: React.PropTypes.bool,
  currentStackDeploymentProgress: React.PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  currentStackResourcesLoaded: React.PropTypes.bool.isRequired,
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
  isFetchingEnvironmentConfiguration: React.PropTypes.bool,
  isFetchingNodes: React.PropTypes.bool,
  isFetchingRoles: React.PropTypes.bool,
  isRequestingDelete: React.PropTypes.bool,
  notify: React.PropTypes.func,
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
    currentStackResourcesLoaded: state.stacks.resourcesLoaded,
    currentStackDeploymentInProgress: getCurrentStackDeploymentInProgress(state),
    currentStackDeploymentProgress: getCurrentStackDeploymentProgress(state),
    environmentConfigurationLoaded: state.environmentConfiguration.loaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    isFetchingEnvironmentConfiguration: state.environmentConfiguration.isFetching,
    isFetchingNodes: state.nodes.get('isFetching'),
    isFetchingRoles: state.roles.get('isFetching'),
    isRequestingDelete: state.stacks.get('isRequestingDelete'),
    hasPlans: !state.plans.get('all').isEmpty(),
    inactivePlans: getAllPlansButCurrent(state),
    availableNodes: getAvailableNodes(state),
    roles: state.roles.get('roles'),
    rolesLoaded: state.roles.get('loaded'),
    stacksLoaded: state.stacks.get('isLoaded'),
    unassignedAvailableNodes: getUnassignedAvailableNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    choosePlan: planName => dispatch(CurrentPlanActions.choosePlan(planName)),
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName)),
    fetchStackEnvironment: (stack) => dispatch(StacksActions.fetchEnvironment(stack)),
    fetchEnvironmentConfiguration: (planName, parentPath) => {
      dispatch(EnvironmentConfigurationActions.fetchEnvironmentConfiguration(planName, parentPath));
    },
    fetchNodes: () => dispatch(NodesActions.fetchNodes()),
    fetchRoles: () => dispatch(RolesActions.fetchRoles()),
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

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan);
