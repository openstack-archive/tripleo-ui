import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import { getCurrentStack, getAllPlansButCurrent } from '../../selectors/plans';
import DeploymentStatus from './DeploymentStatus';
import DeploymentStep from './DeploymentStep';
import PlansDropdown from './PlansDropdown';
import FlavorStore from '../../stores/FlavorStore';
import Loader from '../ui/Loader';
import NoPlans from './NoPlans';
import NotificationActions from '../../actions/NotificationActions';
import PlansActions from '../../actions/PlansActions';
import TripleOApiService from '../../services/TripleOApiService';
import TripleOApiErrorHandler from '../../services/TripleOApiErrorHandler';

class DeploymentPlan extends React.Component {
  constructor() {
    super();
    this.state = {
      readyToDeploy: true,
      flavors: []
    };
  }

  componentDidMount() {
    this.setState({flavors: FlavorStore.getState().flavors});
    this.props.fetchStacks();
  }

  handleDeploy() {
    TripleOApiService.deployPlan(this.props.currentPlanName).then((response) => {
      this.setState({ parameters: response.parameters });
      this.props.fetchStacks();
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

  renderDeployStep() {
    return !this.props.currentStack ? (
      <div className="actions pull-left">
        <a className={'link btn btn-primary btn-lg ' +
                      (this.state.readyToDeploy ? '' : 'disabled')}
           onClick={this.handleDeploy.bind(this)}>
          <span className="fa fa-send"/> Verify and Deploy
        </a>
      </div>
    ) : (
      <DeploymentStatus stack={this.props.currentStack}
                        fetchStacks={this.props.fetchStacks}/>
    );
  }

  render() {
    let deploymentConfigLinks = [
      <Link className="btn btn-link" key="1" to={'/' + this.props.route.path + '/environment'}>
        Edit Configuration
      </Link>
    ];

    let roleConfigLinks = [
      <Link className="btn btn-link" key="2" to={'/' + this.props.route.path + '/parameters'}>
        Edit Parameters
      </Link>
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
                <DeploymentStep title="Create Flavors and Register Nodes"
                                subTitle={this.state.flavors.length > 0 ?
                                 '' : 'There are no flavors or nodes currently.'} />
                <DeploymentStep title="Configure and Assign Roles"
                                subTitle="Parameters for all roles can be configured."
                                links={roleConfigLinks}/>
                <DeploymentStep title="Deploy">
                  {this.renderDeployStep()}
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
  currentStack: ImmutablePropTypes.record,
  fetchStacks: React.PropTypes.func,
  hasPlans: React.PropTypes.bool,
  inactivePlans: ImmutablePropTypes.map,
  isFetchingPlans: React.PropTypes.bool,
  route: React.PropTypes.object
};

export function mapStateToProps(state) {
  return {
    currentPlanName: state.plans.get('currentPlanName'),
    currentStack: getCurrentStack(state),
    isFetchingPlans: state.plans.get('isFetchingPlans'),
    hasPlans: !state.plans.get('all').isEmpty(),
    inactivePlans: getAllPlansButCurrent(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    choosePlan: planName => {
      dispatch(PlansActions.choosePlan(planName));
    },
    fetchStacks: () => {
      dispatch(PlansActions.fetchStacks());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentPlan);
