import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from './ui/Loader';
import I18nActions from '../actions/I18nActions';
import LoginActions from '../actions/LoginActions';
import PlansActions from '../actions/PlansActions';
import NavBar from './NavBar';
import ValidationsList from './validations/ValidationsList';
import WorkflowExecutionsActions from '../actions/WorkflowExecutionsActions';

class AuthenticatedContent extends React.Component {
  componentDidMount() {
    this.props.fetchPlans();
    this.props.fetchWorkflowExecutions();
  }

  render() {
    return (
      <Loader loaded={this.props.plansLoaded &&
                      (!!this.props.currentPlanName || this.props.noPlans)}
              content="Loading Deployments..."
              global>
        <header>
          <NavBar user={this.props.user}
                  onLogout={this.props.logoutUser.bind(this)}
                  chooseLanguage={this.props.chooseLanguage.bind(this)}/>
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
  chooseLanguage: React.PropTypes.func.isRequired,
  currentPlanName: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  fetchPlans: React.PropTypes.func,
  fetchWorkflowExecutions: React.PropTypes.func,
  logoutUser: React.PropTypes.func.isRequired,
  noPlans: React.PropTypes.bool,
  plansLoaded: React.PropTypes.bool,
  user: ImmutablePropTypes.map
};

const mapDispatchToProps = dispatch => {
  return {
    chooseLanguage: (language) => dispatch(I18nActions.chooseLanguage(language)),
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
    user: state.login.getIn(['keystoneAccess', 'user'])
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedContent);
