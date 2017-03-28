import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from './ui/Loader';
import LoginActions from '../actions/LoginActions';
import PlansActions from '../actions/PlansActions';
import NavBar from './NavBar';
import ValidationsList from './validations/ValidationsList';
import WorkflowExecutionsActions from '../actions/WorkflowExecutionsActions';

const messages = defineMessages({
  loadingDeployments: {
    id: 'AuthenticatedContent.loadingDeployments',
    defaultMessage: 'Loading Deployments...'
  }
});

class AuthenticatedContent extends React.Component {
  componentDidMount() {
    this.props.fetchPlans();
    this.props.fetchWorkflowExecutions();
  }

  render() {
    return (
      <Loader loaded={this.props.plansLoaded &&
                      (!!this.props.currentPlanName || this.props.noPlans)}
              content={this.props.intl.formatMessage(messages.loadingDeployments)}
              global>
        <header>
          <NavBar user={this.props.user}
                  onLogout={this.props.logoutUser.bind(this)}/>
        </header>
        <div className="wrapper-fixed-body container-fluid">
          <div className="row">
            <div className="col-sm-12 col-lg-9">{this.props.children}</div>
            <ValidationsList/>
          </div>
        </div>
      </Loader>
    );
  }
}
AuthenticatedContent.propTypes = {
  children: React.PropTypes.node,
  currentPlanName: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  fetchPlans: React.PropTypes.func,
  fetchWorkflowExecutions: React.PropTypes.func,
  intl: React.PropTypes.object,
  logoutUser: React.PropTypes.func.isRequired,
  noPlans: React.PropTypes.bool,
  plansLoaded: React.PropTypes.bool,
  user: ImmutablePropTypes.map
};

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(LoginActions.logoutUser()),
    fetchPlans: () => dispatch(PlansActions.fetchPlans()),
    fetchWorkflowExecutions: () => dispatch(WorkflowExecutionsActions.fetchWorkflowExecutions())
  };
};

const mapStateToProps = state => {
  return {
    currentPlanName: state.currentPlan.currentPlanName,
    noPlans: state.plans.get('all').isEmpty(),
    plansLoaded: state.plans.get('plansLoaded'),
    user: state.login.getIn(['token', 'user'])
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AuthenticatedContent));
