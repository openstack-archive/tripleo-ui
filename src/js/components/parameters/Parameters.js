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

import { connect } from 'react-redux'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import Formsy from 'formsy-react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { isObjectLike, mapValues } from 'lodash'
import { Link } from 'react-router-dom'
import { fromJS, is } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'

import EnvironmentConfigurationActions
  from '../../actions/EnvironmentConfigurationActions'
import EnvironmentParameters from './EnvironmentParameters'
import { getCurrentPlanName } from '../../selectors/plans'
import { getRootParameters } from '../../selectors/parameters'
import {
  getEnabledEnvironments
} from '../../selectors/environmentConfiguration'
import Loader from '../ui/Loader'
import ModalFormErrorList from '../ui/forms/ModalFormErrorList'
import ParametersActions from '../../actions/ParametersActions'
import ParameterInputList from './ParameterInputList'
import Tab from '../ui/Tab'
import TabPane from '../ui/TabPane'

const messages = defineMessages({
  saveChanges: {
    id: 'Parameters.saveChanges',
    defaultMessage: 'Save Changes'
  },
  saveAndClose: {
    id: 'Parameters.saveAndClose',
    defaultMessage: 'Save And Close'
  },
  cancel: {
    id: 'Parameters.cancel',
    defaultMessage: 'Cancel'
  },
  general: {
    id: 'Parameters.general',
    defaultMessage: 'General'
  }
})

class Parameters extends React.Component {
  constructor() {
    super()
    this.state = {
      canSubmit: false,
      closeOnSubmit: false,
      selectedTab: 'general'
    }
  }

  componentDidMount() {
    const {
      currentPlanName,
      fetchEnvironmentConfiguration,
      fetchParameters,
      isFetchingParameters
    } = this.props
    fetchEnvironmentConfiguration(currentPlanName)
    !isFetchingParameters && fetchParameters(currentPlanName)
  }

  componentDidUpdate() {
    this.invalidateForm(this.props.formFieldErrors.toJS())
  }

  enableButton() {
    this.setState({ canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  /**
  * Filter out non updated parameters, so only parameters which have been actually changed
  * get sent to updateparameters
  */
  _filterFormData(formData) {
    return fromJS(formData)
      .filterNot((value, key) => {
        return is(fromJS(this.props.allParameters.get(key).default), value)
      })
      .toJS()
  }

  /**
  * Json parameter values are sent as string, this function parses them and checks if they're object
  * or array. Also, parameters with undefined value are set to null
  */
  _jsonParseFormData(formData) {
    return mapValues(formData, value => {
      try {
        const parsedValue = JSON.parse(value)
        if (isObjectLike(parsedValue)) {
          return parsedValue
        }
        return value
      } catch (e) {
        return value === undefined ? null : value
      }
    })
  }

  invalidateForm(formFieldErrors) {
    this.refs.parameterConfigurationForm.updateInputsWithError(formFieldErrors)
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    this.disableButton()

    this.props.updateParameters(
      this.props.currentPlanName,
      this._filterFormData(this._jsonParseFormData(formData)),
      Object.keys(this.refs.parameterConfigurationForm.inputs)
    )

    if (this.state.closeOnSubmit) {
      this.setState({
        closeOnSubmit: false
      })

      this.props.history.push(`/plans/${this.props.currentPlanName}`)
    }
  }

  onSubmitAndClose() {
    this.setState(
      {
        closeOnSubmit: true
      },
      this.refs.parameterConfigurationForm.submit
    )
  }

  selectTab(tabName) {
    this.setState({
      selectedTab: tabName
    })
  }

  renderTabs() {
    return this.props.enabledEnvironments.toList().map(environment => {
      return (
        <Tab
          key={environment.file}
          title={environment.description}
          isActive={environment.file === this.state.selectedTab}
        >
          <a
            className="link"
            onClick={this.selectTab.bind(this, environment.file)}
          >
            {environment.title}
          </a>
        </Tab>
      )
    })
  }

  renderTabPanes() {
    if (this.state.selectedTab === 'general') {
      return (
        <TabPane isActive>
          <ParameterInputList
            parameters={this.props.parameters.toList()}
            mistralParameters={this.props.mistralParameters}
          />
        </TabPane>
      )
    } else {
      return this.props.enabledEnvironments.toList().map(environment => {
        return (
          <TabPane
            isActive={this.state.selectedTab === environment.file}
            key={environment.file}
            renderOnlyActive
          >
            <EnvironmentParameters environment={environment.file} />
          </TabPane>
        )
      })
    }
  }

  render() {
    return (
      <Formsy.Form
        ref="parameterConfigurationForm"
        role="form"
        className="form form-horizontal"
        onSubmit={this.handleSubmit.bind(this)}
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}
      >

        <div className="container-fluid">
          <div className="row row-eq-height">
            <div className="col-sm-4 sidebar-pf sidebar-pf-left">
              <ul className="nav nav-pills nav-stacked nav-arrows">
                <Tab
                  key="general"
                  title={this.props.intl.formatMessage(messages.general)}
                  isActive={'general' === this.state.selectedTab}
                >
                  <a
                    className="link"
                    onClick={this.selectTab.bind(this, 'general')}
                  >
                    <FormattedMessage {...messages.general} />
                  </a>
                </Tab>
                <li className="spacer" />
                {this.renderTabs()}
              </ul>
            </div>
            <div className="col-sm-8">
              <Loader
                height={120}
                content="Fetching Parameters..."
                loaded={this.props.parametersLoaded}
              >
                <ModalFormErrorList errors={this.props.formErrors.toJS()} />
                <div className="tab-content">
                  {this.renderTabPanes()}
                </div>
              </Loader>
            </div>
          </div>
        </div>

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
          <Link
            to={`/plans/${this.props.currentPlanName}`}
            type="button"
            className="btn btn-default"
          >
            <FormattedMessage {...messages.cancel} />
          </Link>
        </div>
      </Formsy.Form>
    )
  }
}
Parameters.propTypes = {
  allParameters: ImmutablePropTypes.map.isRequired,
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
  parametersLoaded: PropTypes.bool,
  updateParameters: PropTypes.func
}

function mapStateToProps(state, ownProps) {
  return {
    allParameters: state.parameters.parameters,
    enabledEnvironments: getEnabledEnvironments(state),
    form: state.parameters.form,
    formErrors: state.parameters.form.get('formErrors'),
    formFieldErrors: state.parameters.form.get('formFieldErrors'),
    currentPlanName: getCurrentPlanName(state),
    isFetchingParameters: state.parameters.isFetching,
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRootParameters(state),
    parametersLoaded: state.parameters.loaded
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchEnvironmentConfiguration: currentPlanName => {
      dispatch(
        EnvironmentConfigurationActions.fetchEnvironmentConfiguration(
          currentPlanName,
          () => ownProps.history.push(`/plans/${currentPlanName}`)
        )
      )
    },
    fetchParameters: currentPlanName => {
      dispatch(
        ParametersActions.fetchParameters(currentPlanName, () =>
          ownProps.history.push(`/plans/${currentPlanName}`)
        )
      )
    },
    updateParameters: (currentPlanName, data, inputFields, redirect) => {
      dispatch(
        ParametersActions.updateParameters(
          currentPlanName,
          data,
          inputFields,
          redirect
        )
      )
    }
  }
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Parameters)
)
