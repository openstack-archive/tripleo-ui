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

import * as _ from 'lodash';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import EnvironmentConfigurationActions
  from '../../actions/EnvironmentConfigurationActions';
import EnvironmentConfigurationTopic from './EnvironmentConfigurationTopic';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import { getTopicsTree } from '../../selectors/environmentConfiguration';
import Loader from '../ui/Loader';
import Tab from '../ui/Tab';
import TabPane from '../ui/TabPane';

const messages = defineMessages({
  cancel: {
    id: 'EnvironmentConfiguration.cancel',
    defaultMessage: 'Cancel'
  },
  saveChanges: {
    id: 'EnvironmentConfiguration.saveChanges',
    defaultMessage: 'Save Changes'
  },
  saveAndClose: {
    id: 'EnvironmentConfiguration.saveAndClose',
    defaultMessage: 'Save And Close'
  }
});

class EnvironmentConfiguration extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false,
      closeOnSubmit: false,
      activeTab: undefined
    };
  }

  componentDidMount() {
    this.props.fetchEnvironmentConfiguration(this.props.currentPlanName, () =>
      this.props.history.push('/deployment-plan')
    );
  }

  componentDidUpdate() {
    this.invalidateForm(this.props.formFieldErrors.toJS());
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  invalidateForm(formFieldErrors) {
    this.refs.environmentConfigurationForm.updateInputsWithError(
      formFieldErrors
    );
  }

  /*
  * Formsy splits data into objects by '.', file names include '.'
  * so we need to convert data back to e.g. { filename.yaml: true, ... }
  */
  _convertFormData(formData) {
    return _.mapValues(
      _.mapKeys(formData, (value, key) => {
        return key + '.yaml';
      }),
      value => {
        return value.yaml;
      }
    );
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    const data = this._convertFormData(formData);
    this.disableButton();
    this.props.updateEnvironmentConfiguration(
      this.props.currentPlanName,
      data,
      Object.keys(this.refs.environmentConfigurationForm.inputs)
    );

    if (this.state.closeOnSubmit) {
      this.setState({
        closeOnSubmit: false
      });

      this.props.history.push('/deployment-plan');
    }
  }

  onSubmitAndClose() {
    this.setState(
      {
        closeOnSubmit: true
      },
      this.refs.environmentConfigurationForm.submit
    );
  }

  activateTab(tabName, e) {
    e.preventDefault();
    this.setState({ activeTab: tabName });
  }

  isTabActive(tabName) {
    let firstTabName = _.camelCase(
      this.props.environmentConfigurationTopics.first().get('title')
    );
    let currentTab = this.state.activeTab || firstTabName;
    return currentTab === tabName;
  }

  render() {
    let topics = this.props.environmentConfigurationTopics
      .toList()
      .map((topic, index) => {
        let tabName = _.camelCase(topic.get('title'));
        return (
          <TabPane isActive={this.isTabActive(tabName)} key={index}>
            <EnvironmentConfigurationTopic
              key={index}
              title={topic.get('title')}
              description={topic.get('description')}
              environmentGroups={topic.get('environment_groups')}
            />
          </TabPane>
        );
      });

    let topicTabs = this.props.environmentConfigurationTopics
      .toList()
      .map((topic, index) => {
        let tabName = _.camelCase(topic.get('title'));
        return (
          <Tab key={index} isActive={this.isTabActive(tabName)}>
            <a href="" onClick={this.activateTab.bind(this, tabName)}>
              {topic.get('title')}
            </a>
          </Tab>
        );
      });

    return (
      <Formsy.Form
        ref="environmentConfigurationForm"
        role="form"
        className="form"
        onSubmit={this.handleSubmit.bind(this)}
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}
      >
        <Loader height={60} loaded={!this.props.isFetching}>
          <ModalFormErrorList errors={this.props.formErrors.toJS()} />
          <div className="container-fluid">
            <div className="row row-eq-height">
              <div className="col-sm-4 sidebar-pf sidebar-pf-left">
                <ul id="DeploymentConfiguration__CategoriesList" className="nav nav-pills nav-stacked nav-arrows">
                  {topicTabs}
                </ul>
              </div>
              <div className="col-sm-8">
                <div className="tab-content">
                  {topics}
                </div>
              </div>
            </div>
          </div>
        </Loader>

        <div className="modal-footer">
          <button
            type="submit"
            disabled={!this.state.canSubmit}
            className="btn btn-primary"
          >
            <FormattedMessage {...messages.saveChanges} />
          </button>
          <button
            type="button"
            disabled={!this.state.canSubmit}
            onClick={this.onSubmitAndClose.bind(this)}
            className="btn btn-default"
          >
            <FormattedMessage {...messages.saveAndClose} />
          </button>
          <Link to="/deployment-plan" type="button" className="btn btn-default">
            <FormattedMessage {...messages.cancel} />
          </Link>
        </div>
      </Formsy.Form>
    );
  }
}
EnvironmentConfiguration.propTypes = {
  currentPlanName: PropTypes.string,
  environmentConfigurationTopics: ImmutablePropTypes.map.isRequired,
  fetchEnvironment: PropTypes.func,
  fetchEnvironmentConfiguration: PropTypes.func,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  history: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  location: PropTypes.object,
  updateEnvironmentConfiguration: PropTypes.func
};

function mapStateToProps(state) {
  return {
    currentPlanName: state.currentPlan.currentPlanName,
    environmentConfigurationTopics: getTopicsTree(state),
    formErrors: state.environmentConfiguration.getIn(['form', 'formErrors']),
    formFieldErrors: state.environmentConfiguration.getIn([
      'form',
      'formFieldErrors'
    ]),
    isFetching: state.environmentConfiguration.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
  };
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(EnvironmentConfiguration)
);

/**
* requiresEnvironments validation
* Invalidates input if it is selected and environment it requires is not.
* example: validations="requiredEnvironments:['some_environment.yaml']"
*/
Formsy.addValidationRule('requiredEnvironments', function(
  values,
  value,
  requiredEnvironmentFieldNames
) {
  if (value) {
    return !_.filter(
      _.values(_.pick(values, requiredEnvironmentFieldNames)),
      function(val) {
        return val === false;
      }
    ).length;
  }
  return true;
});
