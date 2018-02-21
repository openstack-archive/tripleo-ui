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
import ImmutablePropTypes from 'react-immutable-proptypes';
import { pickBy, isEqual, mapValues } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import EnvironmentParameters from './EnvironmentParameters';
import { getCurrentPlanName } from '../../selectors/plans';
import { getRootParameters } from '../../selectors/parameters';
import { getEnabledEnvironments } from '../../selectors/environmentConfiguration';
import { Loader } from '../ui/Loader';
import ParametersActions from '../../actions/ParametersActions';
import ParametersForm from './ParametersForm';
import ParameterInputList from './NewParameterInputList';
import ParametersSidebar from './ParametersSidebar';
import TabPane from '../ui/TabPane';

class Parameters extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'general'
    };
  }

  componentDidMount() {
    const {
      currentPlanName,
      fetchEnvironmentConfiguration,
      fetchParameters,
      history,
      isFetchingParameters
    } = this.props;
    fetchEnvironmentConfiguration(currentPlanName, () =>
      history.push(`/plans/${currentPlanName}`)
    );
    !isFetchingParameters && fetchParameters(currentPlanName);
  }

  isTabActive = tabName => tabName === this.state.activeTab;

  renderTabPanes() {
    if (this.state.activeTab === 'general') {
      return (
        <TabPane isActive>
          <ParameterInputList
            parameters={this.props.rootParameters.toList()}
            mistralParameters={this.props.mistralParameters}
          />
        </TabPane>
      );
    } else {
      return this.props.enabledEnvironments.toList().map(environment => (
        <TabPane
          isActive={this.state.activeTab === environment.file}
          key={environment.file}
          renderOnlyActive
        >
          <EnvironmentParameters environment={environment.file} />
        </TabPane>
      ));
    }
  }

  /**
   * Filter out non updated parameters, so only parameters which have been actually changed
   * get sent to updateparameters
   */
  _filterFormData(values, initialValues) {
    return pickBy(values, (value, key) => !isEqual(value, initialValues[key]));
  }

  /**
   * Json parameter values are sent as string, this function parses them and checks if they're object
   * or array. Also, parameters with undefined value are set to null
   */
  _parseJsonTypeValues(values, parameters) {
    return mapValues(values, (value, key) => {
      if (parameters.get(key).type.toLowerCase() === 'json') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value === undefined ? null : value;
        }
      }
      return value === undefined ? null : value;
    });
  }

  handleSubmit = ({ saveAndClose, ...values }, dispatch, { initialValues }) => {
    const {
      currentPlanName,
      history,
      parameters,
      updateParameters
    } = this.props;
    const updatedValues = this._parseJsonTypeValues(
      this._filterFormData(values, initialValues),
      parameters
    );
    updateParameters(
      currentPlanName,
      updatedValues,
      saveAndClose && history.push.bind(this, `/plans/${currentPlanName}`)
    );
  };

  _convertJsonTypeParameterValueToString(value) {
    // Heat defaults empty values to empty string also some JSON type parameters
    // accept empty string as valid value
    return ['', undefined].includes(value) ? '' : JSON.stringify(value);
  }

  getFormInitialValues() {
    return this.props.parameters
      .map(p => {
        const value = p.value === undefined ? p.default : p.value;
        if (p.type.toLowerCase() === 'json') {
          return this._convertJsonTypeParameterValueToString(value);
        } else {
          return value;
        }
      })
      .toJS();
  }

  render() {
    const {
      enabledEnvironments,
      parameters,
      isFetchingParameters
    } = this.props;
    return (
      <Loader
        height={120}
        content="Fetching Parameters..."
        loaded={!isFetchingParameters}
        componentProps={{ className: 'flex-container' }}
      >
        <ParametersForm
          onSubmit={this.handleSubmit}
          parameters={parameters}
          initialValues={this.getFormInitialValues()}
          className="flex-container"
        >
          <ParametersSidebar
            activateTab={tabName => this.setState({ activeTab: tabName })}
            enabledEnvironments={enabledEnvironments.toList()}
            isTabActive={this.isTabActive}
          />
          <div className="col-sm-8 flex-column">
            <div className="tab-content">{this.renderTabPanes()}</div>
          </div>
        </ParametersForm>
      </Loader>
    );
  }
}
Parameters.propTypes = {
  currentPlanName: PropTypes.string,
  enabledEnvironments: ImmutablePropTypes.map.isRequired,
  fetchEnvironmentConfiguration: PropTypes.func.isRequired,
  fetchParameters: PropTypes.func.isRequired,
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  history: PropTypes.object,
  intl: PropTypes.object,
  isFetchingParameters: PropTypes.bool.isRequired,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  rootParameters: ImmutablePropTypes.map.isRequired,
  updateParameters: PropTypes.func
};

function mapStateToProps(state, ownProps) {
  return {
    parameters: state.parameters.parameters,
    enabledEnvironments: getEnabledEnvironments(state),
    form: state.parameters.form,
    formErrors: state.parameters.form.get('formErrors'),
    formFieldErrors: state.parameters.form.get('formFieldErrors'),
    currentPlanName: getCurrentPlanName(state),
    isFetchingParameters: state.parameters.isFetching,
    mistralParameters: state.parameters.mistralParameters,
    rootParameters: getRootParameters(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchEnvironmentConfiguration: currentPlanName => {
      dispatch(
        EnvironmentConfigurationActions.fetchEnvironmentConfiguration(
          currentPlanName,
          () => ownProps.history.push(`/plans/${currentPlanName}`)
        )
      );
    },
    fetchParameters: currentPlanName => {
      dispatch(
        ParametersActions.fetchParameters(currentPlanName, () =>
          ownProps.history.push(`/plans/${currentPlanName}`)
        )
      );
    },
    updateParameters: (currentPlanName, data, redirect) => {
      dispatch(
        ParametersActions.updateParameters(currentPlanName, data, redirect)
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Parameters);
