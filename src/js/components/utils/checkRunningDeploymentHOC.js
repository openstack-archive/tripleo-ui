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

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { notify } from '../../actions/NotificationActions';
import { getCurrentPlanDeploymentIsInProgress } from '../../selectors/deployment';
import { getCurrentPlanName } from '../../selectors/plans';

export const checkRunningDeployment = WrappedComponent => {
  class CheckRunningDeploymentHOC extends React.Component {
    componentDidMount() {
      if (this.props.deploymentInProgress) {
        this.props.notify({
          title: 'Not allowed',
          message: `A deployment for the plan ${
            this.props.currentPlanName
          } is already in progress.`,
          type: 'warning'
        });
      }
    }

    render() {
      return this.props.deploymentInProgress ? (
        <Redirect to={`/plans/${this.props.currentPlanName}`} />
      ) : (
        <WrappedComponent {...this.props} />
      );
    }
  }
  CheckRunningDeploymentHOC.propTypes = {
    currentPlanName: PropTypes.string,
    deploymentInProgress: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired
  };

  const mapStateToProps = state => ({
    currentPlanName: getCurrentPlanName(state),
    deploymentInProgress: getCurrentPlanDeploymentIsInProgress(state)
  });

  return connect(mapStateToProps, { notify })(CheckRunningDeploymentHOC);
};
