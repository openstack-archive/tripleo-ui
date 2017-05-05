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
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';

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
  children: PropTypes.node,
  currentPlanName: PropTypes.string,
  dispatch: PropTypes.func,
  fetchPlans: PropTypes.func,
  fetchWorkflowExecutions: PropTypes.func,
  intl: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
  noPlans: PropTypes.bool,
  plansLoaded: PropTypes.bool,
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
