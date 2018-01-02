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

import { camelCase, mapKeys } from 'lodash';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import EnvironmentConfigurationForm from './EnvironmentConfigurationForm';
import EnvironmentConfigurationSidebar from './EnvironmentConfigurationSidebar';
import EnvironmentConfigurationTopic from './EnvironmentConfigurationTopic';
import { getCurrentPlanName } from '../../selectors/plans';
import {
  getEnvironments,
  getTopicsTree
} from '../../selectors/environmentConfiguration';
import { Loader } from '../ui/Loader';
import TabPane from '../ui/TabPane';

const messages = defineMessages({
  loadingEnvironmentConfiguration: {
    id: 'EnvironmentConfiguration.loadingEnvironmentConfiguration',
    defaultMessage: 'Loading Deployment Configuration...'
  }
});

class EnvironmentConfiguration extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: undefined
    };
  }

  componentDidMount() {
    const {
      currentPlanName,
      fetchEnvironmentConfiguration,
      history
    } = this.props;
    fetchEnvironmentConfiguration(currentPlanName, () =>
      history.push(`/plans/${currentPlanName}`)
    );
  }

  isTabActive = tabName => {
    const firstTabName = camelCase(
      this.props.environmentConfigurationTopics.first().get('title')
    );
    const currentTab = this.state.activeTab || firstTabName;
    return currentTab === tabName;
  };

  renderTopics = () => {
    const { environmentConfigurationTopics } = this.props;
    return environmentConfigurationTopics.toList().map((topic, index) => {
      const tabName = camelCase(topic.get('title'));
      return (
        <TabPane
          isActive={this.isTabActive(tabName)}
          key={index}
          renderOnlyActive
        >
          <EnvironmentConfigurationTopic
            title={topic.get('title')}
            description={topic.get('description')}
            environmentGroups={topic.get('environment_groups')}
          />
        </TabPane>
      );
    });
  };

  handleSubmit = ({ saveAndClose, ...values }, dispatch, props) => {
    const data = mapKeys(values, (_, k) => k.replace(':', '.'));
    const {
      currentPlanName,
      history,
      updateEnvironmentConfiguration
    } = this.props;
    if (saveAndClose) {
      updateEnvironmentConfiguration(currentPlanName, data, () =>
        history.push(`/plans/${currentPlanName}`)
      );
    } else {
      updateEnvironmentConfiguration(currentPlanName, data);
    }
  };

  /**
   * Initial values are all enabled environments, keys are changed as dots
   * in input names cause unwanted splitting into nested objects
   */
  getFormInitialValues() {
    return this.props.allEnvironments
      .mapKeys(k => k.replace('.', ':'))
      .filter(e => e.enabled)
      .map(e => e.enabled)
      .toJS();
  }

  render() {
    const {
      allEnvironments,
      environmentConfigurationTopics,
      isFetching,
      intl: { formatMessage }
    } = this.props;

    return (
      <Loader
        height={60}
        loaded={!isFetching}
        content={formatMessage(messages.loadingEnvironmentConfiguration)}
      >
        <EnvironmentConfigurationForm
          allEnvironments={allEnvironments}
          onSubmit={this.handleSubmit}
          initialValues={this.getFormInitialValues()}
        >
          <div className="container-fluid">
            <div className="row row-eq-height">
              <EnvironmentConfigurationSidebar
                activateTab={tabName => this.setState({ activeTab: tabName })}
                categories={environmentConfigurationTopics.toList().toJS()}
                isTabActive={this.isTabActive}
              />
              <div className="col-sm-8">
                <div className="tab-content">{this.renderTopics()}</div>
              </div>
            </div>
          </div>
        </EnvironmentConfigurationForm>
      </Loader>
    );
  }
}
EnvironmentConfiguration.propTypes = {
  allEnvironments: ImmutablePropTypes.map.isRequired,
  currentPlanName: PropTypes.string,
  environmentConfigurationTopics: ImmutablePropTypes.map.isRequired,
  fetchEnvironment: PropTypes.func,
  fetchEnvironmentConfiguration: PropTypes.func,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  history: PropTypes.object.isRequired,
  intl: PropTypes.object,
  isFetching: PropTypes.bool,
  location: PropTypes.object,
  updateEnvironmentConfiguration: PropTypes.func
};

const mapStateToProps = state => ({
  currentPlanName: getCurrentPlanName(state),
  allEnvironments: getEnvironments(state),
  environmentConfigurationTopics: getTopicsTree(state),
  formErrors: state.environmentConfiguration.getIn(['form', 'formErrors']),
  formFieldErrors: state.environmentConfiguration.getIn([
    'form',
    'formFieldErrors'
  ]),
  isFetching: state.environmentConfiguration.isFetching
});

const mapDispatchToProps = dispatch => ({
  fetchEnvironmentConfiguration: planName => {
    dispatch(
      EnvironmentConfigurationActions.fetchEnvironmentConfiguration(planName)
    );
  },
  updateEnvironmentConfiguration: (planName, data, inputFields) => {
    dispatch(
      EnvironmentConfigurationActions.updateEnvironmentConfiguration(
        planName,
        data,
        inputFields
      )
    );
  }
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(EnvironmentConfiguration)
);
