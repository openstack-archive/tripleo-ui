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
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Formsy from 'formsy-react';
import { fromJS, is } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isObjectLike, mapValues } from 'lodash';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { checkRunningDeployment } from '../utils/checkRunningDeploymentHOC';
import { getCurrentPlanName } from '../../selectors/plans';
import { getRole } from '../../selectors/roles';
import { getRoleServices } from '../../selectors/parameters';
import { Loader } from '../ui/Loader';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import {
  ModalPanelBackdrop,
  ModalPanel,
  ModalPanelHeader,
  ModalPanelBody,
  ModalPanelFooter
} from '../ui/ModalPanel';
import NavTab from '../ui/NavTab';
import ParametersActions from '../../actions/ParametersActions';
import RoleNetworkConfig from './RoleNetworkConfig';
import RoleParameters from './RoleParameters';
import RoleServices from './RoleServices';

const messages = defineMessages({
  networkConfiguration: {
    id: 'RoleDetail.networkConfiguration',
    defaultMessage: 'Network Configuration'
  },
  parameters: {
    id: 'RoleDetail.parameters',
    defaultMessage: 'Parameters'
  },
  role: {
    id: 'RoleDetail.role',
    defaultMessage: '{roleName} Role'
  },
  loadingParameters: {
    id: 'RoleDetail.loadingParameters',
    defaultMessage: 'Loading parameters...'
  },
  saveChanges: {
    id: 'RoleDetail.saveChanges',
    defaultMessage: 'Save Changes'
  },
  services: {
    id: 'RoleDetail.services',
    defaultMessage: 'Services'
  }
});

class RoleDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false
    };
  }

  componentDidMount() {
    const { currentPlanName } = this.props;
    this.props.fetchParameters(currentPlanName, `/plans/${currentPlanName}`);
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

  /**
  * Filter out non updated parameters, so only parameters which have been actually changed
  * get sent to updateparameters
  */
  _filterFormData(formData) {
    return fromJS(formData)
      .filterNot((value, key) => {
        return is(fromJS(this.props.allParameters.get(key).default), value);
      })
      .toJS();
  }

  /**
  * Json parameter values are sent as string, this function parses them and checks if they're object
  * or array. Also, parameters with undefined value are set to null
  */
  _jsonParseFormData(formData) {
    return mapValues(formData, value => {
      try {
        const parsedValue = JSON.parse(value);
        if (isObjectLike(parsedValue)) {
          return parsedValue;
        }
        return value;
      } catch (e) {
        return value === undefined ? null : value;
      }
    });
  }

  invalidateForm(formFieldErrors) {
    this.refs.roleParametersForm.updateInputsWithError(formFieldErrors);
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    this.disableButton();

    this.props.updateParameters(
      this.props.currentPlanName,
      this._filterFormData(this._jsonParseFormData(formData)),
      Object.keys(this.refs.roleParametersForm.inputs)
    );
  }

  renderRoleTabs() {
    const {
      currentPlanName,
      formErrors,
      match: { params: urlParams },
      parametersLoaded,
      rolesLoaded
    } = this.props;
    if (rolesLoaded && parametersLoaded) {
      return (
        <div className="row">
          <ul className="nav nav-tabs">
            <NavTab
              to={`/plans/${currentPlanName}/roles/${urlParams.roleIdentifier}/parameters`}
            >
              <FormattedMessage {...messages.parameters} />
            </NavTab>
            <NavTab
              to={`/plans/${currentPlanName}/roles/${urlParams.roleIdentifier}/services`}
            >
              <FormattedMessage {...messages.services} />
            </NavTab>
            <NavTab
              to={`/plans/${currentPlanName}/roles/${urlParams.roleIdentifier}/network-configuration`}
            >
              <FormattedMessage {...messages.networkConfiguration} />
            </NavTab>
          </ul>
          <ModalFormErrorList errors={formErrors.toJS()} />
        </div>
      );
    }
  }

  render() {
    const dataLoaded = this.props.rolesLoaded && this.props.parametersLoaded;
    const roleName = this.props.role ? this.props.role.name : null;
    const {
      currentPlanName,
      intl,
      location,
      match: { params: urlParams }
    } = this.props;

    return (
      <Formsy.Form
        ref="roleParametersForm"
        role="form"
        className="form form-horizontal"
        onSubmit={this.handleSubmit.bind(this)}
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}
      >
        <ModalPanelBackdrop />
        <ModalPanel>
          <ModalPanelHeader>
            <Link
              to={`/plans/${currentPlanName}`}
              type="button"
              className="close"
            >
              <span aria-hidden="true" className="pficon pficon-close" />
            </Link>
            <h2 className="modal-title">
              <FormattedMessage
                {...messages.role}
                values={{ roleName: roleName }}
              />
            </h2>
          </ModalPanelHeader>
          {this.renderRoleTabs()}
          <ModalPanelBody>
            <Loader
              height={60}
              content={intl.formatMessage(messages.loadingParameters)}
              loaded={dataLoaded}
            >
              <Switch location={location}>
                <Route
                  path="/plans/:planName/roles/:roleIdentifier/parameters"
                  component={RoleParameters}
                />
                <Route
                  path="/plans/:planName/roles/:roleIdentifier/services"
                  component={RoleServices}
                />
                <Route
                  path="/plans/:planName/roles/:roleIdentifier/network-configuration"
                  component={RoleNetworkConfig}
                />
                <Redirect
                  from="/plans/:planName/roles/:roleIdentifier"
                  to={`/plans/${currentPlanName}/roles/${urlParams.roleIdentifier}/parameters`}
                />
              </Switch>
            </Loader>
          </ModalPanelBody>
          {dataLoaded
            ? <ModalPanelFooter>
                <button
                  type="submit"
                  disabled={!this.state.canSubmit}
                  className="btn btn-primary"
                >
                  <FormattedMessage {...messages.saveChanges} />
                </button>
              </ModalPanelFooter>
            : null}
        </ModalPanel>
      </Formsy.Form>
    );
  }
}
RoleDetail.propTypes = {
  allParameters: ImmutablePropTypes.map.isRequired,
  currentPlanName: PropTypes.string,
  fetchParameters: PropTypes.func,
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  intl: PropTypes.object,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  parametersLoaded: PropTypes.bool.isRequired,
  role: ImmutablePropTypes.record,
  rolesLoaded: PropTypes.bool.isRequired,
  updateParameters: PropTypes.func
};

function mapStateToProps(state, props) {
  return {
    currentPlanName: getCurrentPlanName(state),
    formErrors: state.parameters.form.get('formErrors'),
    formFieldErrors: state.parameters.form.get('formFieldErrors'),
    allParameters: state.parameters.parameters,
    parametersLoaded: state.parameters.loaded,
    role: getRole(state, props.match.params.roleIdentifier),
    roleServices: getRoleServices(state, props.match.params.roleIdentifier),
    rolesLoaded: state.roles.get('loaded')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchParameters: (currentPlanName, redirectPath) => {
      dispatch(
        ParametersActions.fetchParameters(currentPlanName, redirectPath)
      );
    },
    updateParameters: (currentPlanName, data, inputFields, redirectPath) => {
      dispatch(
        ParametersActions.updateParameters(
          currentPlanName,
          data,
          inputFields,
          redirectPath
        )
      );
    }
  };
}

export default checkRunningDeployment(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(RoleDetail))
);
