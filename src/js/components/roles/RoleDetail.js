import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import { fromJS, is } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isObjectLike, mapValues } from 'lodash';
import React from 'react';
import { Link } from 'react-router';

import { getRole } from '../../selectors/roles';
import { getRoleResourceTree, getResourceTreeParameters } from '../../selectors/parameters';
import Loader from '../ui/Loader';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import { ModalPanelBackdrop,
         ModalPanel,
         ModalPanelHeader,
         ModalPanelBody,
         ModalPanelFooter } from '../ui/ModalPanel';
import NavTab from '../ui/NavTab';
import ParametersActions from '../../actions/ParametersActions';

class RoleDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false
    };
  }

  componentDidMount() {
    this.props.fetchParameters(this.props.currentPlanName, '/deployment-plan');
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
    return fromJS(formData).filterNot((parameter, key) => {
      return is(this.props.allParameters.get(key).Default, parameter);
    }).toJS();
  }

  /**
  * Json parameter values are sent as string, this function parses them and checks if they're object
  * or array. Also, parameters with undefined value are set to null
  */
  _jsonParseFormData(formData) {
    return mapValues(formData, (value) => {
      try {
        const parsedValue = JSON.parse(value);
        if (isObjectLike(parsedValue)) {
          return parsedValue;
        }
        return value;
      } catch(e) {
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
    if (this.props.rolesLoaded && this.props.parametersLoaded) {
      return (
        <div className="row">
          <ul className="nav nav-tabs">
            <NavTab to={`/deployment-plan/roles/${this.props.params.roleIdentifier}/parameters`}>
              Parameters
            </NavTab>
            <NavTab to={`/deployment-plan/roles/${this.props.params.roleIdentifier}/services`}>
              Services
            </NavTab>
            <NavTab to={`/deployment-plan/roles/${this.props.params.roleIdentifier}`
                        + '/network-configuration'}>
              Network Configuration
            </NavTab>
          </ul>
          <ModalFormErrorList errors={this.props.formErrors.toJS()}/>
        </div>
      );
    }
  }

  render() {
    const dataLoaded = this.props.rolesLoaded && this.props.parametersLoaded;
    return (
      <Formsy.Form ref="roleParametersForm"
                   role="form"
                   className="form form-horizontal"
                   onSubmit={this.handleSubmit.bind(this)}
                   onValid={this.enableButton.bind(this)}
                   onInvalid={this.disableButton.bind(this)}>
        <ModalPanelBackdrop />
        <ModalPanel>
          <ModalPanelHeader>
            <Link to="/deployment-plan"
                  type="button"
                  className="close">
              <span aria-hidden="true" className="pficon pficon-close"/>
            </Link>
            <h2 className="modal-title">
              {this.props.role ? this.props.role.name : null} Role
            </h2>
          </ModalPanelHeader>
          {this.renderRoleTabs()}
          <ModalPanelBody>
            <Loader height={60}
                    content="Loading parameters..."
                    loaded={dataLoaded}>
              {this.props.children}
            </Loader>
          </ModalPanelBody>
          {dataLoaded ?
            <ModalPanelFooter>
              <button type="submit" disabled={!this.state.canSubmit}
                      className="btn btn-primary">
                Save Changes
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
  children: React.PropTypes.node,
  currentPlanName: React.PropTypes.string,
  fetchParameters: React.PropTypes.func,
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  parametersLoaded: React.PropTypes.bool.isRequired,
  params: React.PropTypes.object.isRequired,
  role: ImmutablePropTypes.record,
  rolesLoaded: React.PropTypes.bool.isRequired,
  updateParameters: React.PropTypes.func
};

function mapStateToProps(state, props) {
  return {
    currentPlanName: state.currentPlan.currentPlanName,
    formErrors: state.parameters.form.get('formErrors'),
    formFieldErrors: state.parameters.form.get('formFieldErrors'),
    allParameters: getResourceTreeParameters(state),
    parametersLoaded: state.parameters.loaded,
    role: getRole(state, props.params.roleIdentifier),
    roleResourceTree: getRoleResourceTree(state, props.params.roleIdentifier),
    rolesLoaded: state.roles.get('loaded')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchParameters: (currentPlanName, redirectPath) => {
      dispatch(ParametersActions.fetchParameters(currentPlanName, redirectPath));
    },
    updateParameters: (currentPlanName, data, inputFields, redirectPath) => {
      dispatch(ParametersActions.updateParameters(
        currentPlanName, data, inputFields, redirectPath));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleDetail);
