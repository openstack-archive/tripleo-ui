import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import { getAllPlansButCurrent } from '../../selectors/plans';
import { getIntrospectedNodes, getUnassignedIntrospectedNodes } from '../../selectors/nodes';
import DeploymentStep from './DeploymentStep';
import PlansDropdown from './PlansDropdown';
import Loader from '../ui/Loader';
import NodesActions from '../../actions/NodesActions';
import NoPlans from './NoPlans';
import NotificationActions from '../../actions/NotificationActions';
import PlansActions from '../../actions/PlansActions';
import Roles from './Roles';
import RolesActions from '../../actions/RolesActions';
import TripleOApiService from '../../services/TripleOApiService';
import TripleOApiErrorHandler from '../../services/TripleOApiErrorHandler';

class DeploymentPlan extends React.Component {
  constructor() {
    super();
    this.state = {
      readyToDeploy: false
    };
  }

  handleDeploy() {
    TripleOApiService.deployPlan(this.props.currentPlanName).then((response) => {
      this.setState({ parameters: response.parameters });
      NotificationActions.notify({
        title: 'Deployment started',
        message: 'The Deployment has been successfully initiated',
        type: 'success'
      });
    }).catch((error) => {
      let errorHandler = new TripleOApiErrorHandler(error);
      errorHandler.errors.forEach((error) => {
        NotificationActions.notify(error);
      });
    });
  }

  render() {
    const deploymentConfigLinks = [
      <Link className="btn btn-link"
            key="deploymentConfiguration"
            to={'/deployment-plan/configuration'}>
        Edit Configuration
      </Link>
    ];

    const registerAndAssignLinks = [
      <Link className="btn btn-default" key="registerNodes" to={'/nodes/registered/register'}>
        <span className="fa fa-plus"/> Register Nodes
      </Link>,
      <span key="space">&nbsp;</span>,
      <Loader key="rolesLoader"
              loaded={!(this.props.rolesLoaded && this.props.isFetchingRoles)}
              content="Loading Deployment Roles..."
              inline/>
    ];

    let children;
    // Render children only when current plan is already selected
    if (this.props.children && this.props.currentPlanName) {
      children = React.cloneElement(this.props.children,
                                    {currentPlanName: this.props.currentPlanName,
                                     parentPath: '/' + this.props.route.path});
    }

    // TODO: Detemerine the real deployment configuration descriptions string
    let deploymentConfigDescription = 'KVM, Neutron with VLAN, Ceph (Default)';

    return (
      <div className="row">
        <Loader loaded={(this.props.currentPlanName || !this.props.hasPlans)
                        && !this.props.isFetchingPlans}
                content="Loading Deployments..."
                global>
          {this.props.hasPlans ? (
            <div className="col-sm-12 deployment-step-list">
              <div className="page-header">
                <h1>
                  {this.props.currentPlanName}
                  <PlansDropdown currentPlanName={this.props.currentPlanName}
                                       plans={this.props.inactivePlans}
                                       choosePlan={this.props.choosePlan}/>
                </h1>
              </div>
              <ol className="deployment-step-list">
                <DeploymentStep title="Specify Deployment Configuration"
                                subTitle={deploymentConfigDescription}
                                links={deploymentConfigLinks}/>
                <DeploymentStep title="Register and Assign Nodes"
                                links={registerAndAssignLinks}>
                  <Roles roles={this.props.roles.toList().toJS()}
                         introspectedNodes={this.props.introspectedNodes}
                         unassignedIntrospectedNodes={this.props.unassignedIntrospectedNodes}
                         fetchRoles={this.props.fetchRoles}
                         fetchNodes={this.props.fetchNodes}
                         isFetchingNodes={this.props.isFetchingNodes}
                         loaded={this.props.rolesLoaded}/>
                </DeploymentStep>
                <DeploymentStep title="Deploy">
                  <div className="actions pull-left">
                    <a className={'link btn btn-primary btn-lg ' +
                                  (this.state.readyToDeploy ? '' : 'disabled')}
                       onClick={this.handleDeploy.bind(this)}>
                      <span className="fa fa-send"/> Verify and Deploy
                    </a>
                  </div>
                </DeploymentStep>
              </ol>
            </div>
          ) : (
            <div className="col-sm-12">
              <NoPlans/>
            </div>
          )}
          {children}
        </Loader>
      </div>
    );
  }
}

DeploymentPlan.propTypes = {
  children: React.PropTypes.node,
  choosePlan: React.PropTypes.func,
  currentPlanName: React.PropTypes.string,
  fetchNodes: React.PropTypes.func,
  fetchRoles: React.PropTypes.func,
  hasPlans: React.PropTypes.bool,
  inactivePlans: ImmutablePropTypes.map,
  introspectedNodes: ImmutablePropTypes.list,
  isFetchingNodes: React.PropTypes.bool,
  isFetchingPlans: React.PropTypes.bool,
  isFetchingRoles: React.PropTypes.bool,
  roles: ImmutablePropTypes.map,
  rolesLoaded: React.PropTypes.bool,
  route: React.PropTypes.object,
  unassignedIntrospectedNodes: ImmutablePropTypes.list
};

export function mapStateToProps(state) {
  return {
    currentPlanName: state.plans.get('currentPlanName'),
    isFetchingNodes: state.nodes.get('isFetching'),
    isFetchingPlans: state.plans.get('isFetchingPlans'),
    isFetchingRoles: state.roles.get('isFetching'),
    hasPlans: !state.plans.get('all').isEmpty(),
    inactivePlans: getAllPlansButCurrent(state),
    introspectedNodes: getIntrospectedNodes(state),
    roles: state.roles.get('roles'),
    rolesLoaded: state.roles.get('loaded'),
    unassignedIntrospectedNodes: getUnassignedIntrospectedNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    choosePlan: planName => dispatch(PlansActions.choosePlan(planName)),
    fetchRoles: () => dispatch(RolesActions.fetchRoles()),
    fetchNodes: () => dispatch(NodesActions.fetchNodes())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan);
