import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { getAllPlansButCurrent } from '../../selectors/plans';
import { getCurrentStack,
         getCurrentStackDeploymentProgress,
         getOvercloudInfo } from '../../selectors/stacks';
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
                                  disabled={this.props.currentStackDeploymentProgress}>
                <HardwareStep />
              </DeploymentPlanStep>
              <DeploymentPlanStep title="Specify Deployment Configuration"
                                  disabled={this.props.currentStackDeploymentProgress}>
                <ConfigurePlanStep
                  fetchEnvironmentConfiguration={this.props.fetchEnvironmentConfiguration}
                  summary={this.props.environmentConfigurationSummary}
                  planName={this.props.currentPlan.name}
                  isFetching={this.props.isFetchingEnvironmentConfiguration}
                  loaded={this.props.environmentConfigurationLoaded}/>
              </DeploymentPlanStep>
              <DeploymentPlanStep title="Configure Roles and Assign Nodes"
                                  disabled={this.props.currentStackDeploymentProgress}>
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
                <DeployStep currentPlan={this.props.currentPlan}
                            currentStack={this.props.currentStack}
                            deployPlan={this.props.deployPlan}
                            fetchStacks={this.props.fetchStacks}
                            getOvercloudInfo={this.props.getOvercloudInfo}
                            overcloud={this.props.overcloud} />
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
  currentStackDeploymentProgress: React.PropTypes.bool,
  deployPlan: React.PropTypes.func,
  environmentConfigurationLoaded: React.PropTypes.bool,
  environmentConfigurationSummary: React.PropTypes.string,
  fetchEnvironmentConfiguration: React.PropTypes.func,
  fetchNodes: React.PropTypes.func,
  fetchRoles: React.PropTypes.func,
  fetchStacks: React.PropTypes.func,
  getOvercloudInfo: React.PropTypes.func,
  hasPlans: React.PropTypes.bool,
  inactivePlans: ImmutablePropTypes.map,
  isFetchingEnvironmentConfiguration: React.PropTypes.bool,
  isFetchingNodes: React.PropTypes.bool,
  isFetchingRoles: React.PropTypes.bool,
  notify: React.PropTypes.func,
  overcloud: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map,
  rolesLoaded: React.PropTypes.bool,
  route: React.PropTypes.object,
  runValidationStage: React.PropTypes.func,
  unassignedAvailableNodes: ImmutablePropTypes.map,
  validationStages: ImmutablePropTypes.map
};

export function mapStateToProps(state) {
  return {
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    currentStackDeploymentProgress: getCurrentStackDeploymentProgress(state),
    environmentConfigurationLoaded: state.environmentConfiguration.loaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    isFetchingEnvironmentConfiguration: state.environmentConfiguration.isFetching,
    isFetchingNodes: state.nodes.get('isFetching'),
    isFetchingRoles: state.roles.get('isFetching'),
    hasPlans: !state.plans.get('all').isEmpty(),
    inactivePlans: getAllPlansButCurrent(state),
    availableNodes: getAvailableNodes(state),
    overcloud: getOvercloudInfo(state),
    roles: state.roles.get('roles'),
    rolesLoaded: state.roles.get('loaded'),
    unassignedAvailableNodes: getUnassignedAvailableNodes(state),
    validationStages: state.validations.get('validationStages')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    choosePlan: planName => dispatch(CurrentPlanActions.choosePlan(planName)),
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName)),
    fetchEnvironmentConfiguration: (planName, parentPath) => {
      dispatch(EnvironmentConfigurationActions.fetchEnvironmentConfiguration(planName, parentPath));
    },
    fetchNodes: () => dispatch(NodesActions.fetchNodes()),
    fetchRoles: () => dispatch(RolesActions.fetchRoles()),
    fetchStacks: () => dispatch(StacksActions.fetchStacks()),
    getOvercloudInfo: stack => dispatch(StacksActions.getOvercloudInfo(stack)),
    notify: notification => dispatch(NotificationActions.notify(notification)),
    runValidationStage: (uuid) => {
      dispatch(ValidationsActions.runValidationStage(uuid));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan);
