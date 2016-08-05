import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import { getAllPlansButCurrent } from '../../selectors/plans';
import { getCurrentStack,
         getCurrentStackDeploymentProgress } from '../../selectors/stacks';
import { getIntrospectedNodes, getUnassignedIntrospectedNodes } from '../../selectors/nodes';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import { getCurrentPlan } from '../../selectors/plans';
import CurrentPlanActions from '../../actions/CurrentPlanActions';
import DeploymentConfigurationSummary from './DeploymentConfigurationSummary';
import DeploymentStatus from './DeploymentStatus';
import DeploymentStep from './DeploymentStep';
import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import PlansDropdown from './PlansDropdown';
import Loader from '../ui/Loader';
import NodesActions from '../../actions/NodesActions';
import NoPlans from './NoPlans';
import NotificationActions from '../../actions/NotificationActions';
import PlanActions from '../../actions/PlansActions';
import StacksActions from '../../actions/StacksActions';
import Roles from './Roles';
import RolesActions from '../../actions/RolesActions';
import ValidationsActions from '../../actions/ValidationsActions';
import { getValidationStageUuidByName } from '../../selectors/validations';

class DeploymentPlan extends React.Component {
  constructor() {
    super();
    this.state = {
      readyToDeploy: true
    };
  }

  componentDidMount() {
    this.props.fetchStacks();
  }

  handleDeploy() {
    this.props.deployPlan(this.props.currentPlan.name);
  }

  renderDeployStep() {
    if (this.props.currentPlan.isRequestingPlanDeploy) {
      return (
        <div className="actions pull-left">
          <a className={'link btn btn-primary btn-lg disabled'}>
            <span className="fa fa-send"/> Verify and Deploy
          </a>
          <p>
            <span className={'spinner spinner-xs spinner-inline'}></span>
            Requesting a deploy...
          </p>
        </div>
      );

    } else if(!this.props.currentStack) {
      return (
        <div className="actions pull-left">
        <a className={'link btn btn-primary btn-lg ' +
                      (this.state.readyToDeploy ? '' : 'disabled')}
           onClick={this.handleDeploy.bind(this)}>
          <span className="fa fa-send"/> Verify and Deploy
        </a>
        </div>
      );
    } else {
      return (
        <DeploymentStatus stack={this.props.currentStack}
                          fetchStacks={this.props.fetchStacks}/>
      );
    }

  }

  runNetworkValidations(e) {
    e.preventDefault();
    const validationStageUuid = getValidationStageUuidByName(
      this.props.validationStages, 'network-validation');
    this.props.runValidationStage(validationStageUuid);
  }

  runHardwareValidations(e) {
    e.preventDefault();
    this.props.runValidationStage(
      getValidationStageUuidByName(this.props.validationStages, 'pre-deployment'));
  }

  runPostDeploymentValidations(e) {
    e.preventDefault();
    this.props.runValidationStage(
      getValidationStageUuidByName(this.props.validationStages, 'post-deployment'));
  }

  render() {
    const deploymentConfigLinks = [
      <Link className="btn btn-link"
            key="deploymentConfiguration"
            to="/deployment-plan/configuration">
        Edit Configuration
      </Link>,
      <p key="networkValidationHint">
        At this point you
        should <a className="link"
                 onClick={this.runNetworkValidations.bind(this)}>run Network Validations</a>.
      </p>
    ];

    const registerAndAssignLinks = [
      <Link className="btn btn-default" key="registerNodes" to="/nodes/registered/register">
        <span className="fa fa-plus"/> Register Nodes
      </Link>,
      <span key="space">&nbsp;</span>,
      <Loader key="rolesLoader"
              loaded={!(this.props.rolesLoaded && this.props.isFetchingRoles)}
              content="Loading Deployment Roles..."
              component="span"
              inline/>,
      <span key="space2">&nbsp;</span>,
      <Loader key="nodesLoader"
              loaded={!this.props.isFetchingNodes}
              content="Loading Nodes..."
              component="span"
              inline>
        There are <strong>{this.props.unassignedIntrospectedNodes.size}</strong> of <strong>
        {this.props.introspectedNodes.size}</strong> Nodes available to assign
      </Loader>
    ];

    let children;
    // Render children only when current plan is already selected
    if (this.props.children && this.props.currentPlan.name) {
      children = React.cloneElement(this.props.children,
                                    {currentPlanName: this.props.currentPlan.name,
                                     parentPath: '/' + this.props.route.path});
    }

    let deploymentConfigurationSummary = (
      <DeploymentConfigurationSummary
        fetchEnvironmentConfiguration={this.props.fetchEnvironmentConfiguration.bind(this)}
        summary={this.props.environmentConfigurationSummary}
        planName={this.props.currentPlan.name}
        isFetching={this.props.isFetchingEnvironmentConfiguration}
        loaded={this.props.environmentConfigurationLoaded}/>
    );

    return (
      <div className="row">
        {this.props.hasPlans ? (
          <div className="col-sm-12 deployment-step-list">
            <div className="page-header page-header-bleed-right">
              <h1>
                {this.props.currentPlan.name}
                <PlansDropdown currentPlanName={this.props.currentPlan.name}
                               plans={this.props.inactivePlans}
                               choosePlan={this.props.choosePlan}/>
              </h1>
            </div>
            <ol className="deployment-step-list">
              <DeploymentStep title="Specify Deployment Configuration"
                              subTitle={deploymentConfigurationSummary}
                              links={deploymentConfigLinks}
                              disabled={this.props.currentStackDeploymentProgress}/>
              <DeploymentStep title="Register and Assign Nodes"
                              links={registerAndAssignLinks}
                              disabled={this.props.currentStackDeploymentProgress}>
                <Roles roles={this.props.roles.toList().toJS()}
                       introspectedNodes={this.props.introspectedNodes}
                       unassignedIntrospectedNodes={this.props.unassignedIntrospectedNodes}
                       fetchRoles={this.props.fetchRoles}
                       fetchNodes={this.props.fetchNodes}
                       isFetchingNodes={this.props.isFetchingNodes}
                       isFetchingRoles={this.props.isFetchingRoles}
                       loaded={this.props.rolesLoaded}/>
                <p>
                  At this point you should run the <a className="link"
                  onClick={this.runHardwareValidations.bind(this)}>Hardware
                  Validations</a>.
                </p>
              </DeploymentStep>
              <DeploymentStep title="Deploy">
                {this.renderDeployStep()}
                <p style={{clear: 'both'}}>
                  At this point you should run <a className="link"
                   onClick={this.runPostDeploymentValidations.bind(this)}>
                  the Post Deployment Validations</a>.
                </p>
              </DeploymentStep>
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
  hasPlans: React.PropTypes.bool,
  inactivePlans: ImmutablePropTypes.map,
  introspectedNodes: ImmutablePropTypes.map,
  isFetchingEnvironmentConfiguration: React.PropTypes.bool,
  isFetchingNodes: React.PropTypes.bool,
  isFetchingRoles: React.PropTypes.bool,
  notify: React.PropTypes.func,
  roles: ImmutablePropTypes.map,
  rolesLoaded: React.PropTypes.bool,
  route: React.PropTypes.object,
  runValidationStage: React.PropTypes.func,
  unassignedIntrospectedNodes: ImmutablePropTypes.map,
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
    introspectedNodes: getIntrospectedNodes(state),
    roles: state.roles.get('roles'),
    rolesLoaded: state.roles.get('loaded'),
    unassignedIntrospectedNodes: getUnassignedIntrospectedNodes(state),
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
    notify: notification => dispatch(NotificationActions.notify(notification)),
    runValidationStage: (uuid) => {
      dispatch(ValidationsActions.runValidationStage(uuid));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan);
