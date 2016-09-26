import * as _ from 'lodash';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { fromJS, is } from 'immutable';
import React from 'react';

import Loader from '../ui/Loader';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import ParametersActions from '../../actions/ParametersActions';
import ParameterInputList from './ParameterInputList';
import { getRootParameters } from '../../selectors/parameters';
import logger from '../../services/logger';

class Parameters extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false
    };
  }

  componentDidMount() {
    this.props.fetchParameters(this.props.currentPlanName, this.props.parentPath);
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
      return is(this.props.parameters.get(key).Default, parameter);
    }).toJS();
  }

  /**
  * Json parameter values are sent as string, this method parses those back to object
  * also, parameters with undefined value are set to null
  */
  _jsonParseFormData(formData) {
    return _.mapValues(formData, (value) => {
      try {
        return JSON.parse(value);
      } catch(e) {
        logger.warn('Failed to parse json', e);
        return value === undefined ? null : value;
      }
    });
  }

  invalidateForm(formFieldErrors) {
    this.refs.parameterConfigurationForm.updateInputsWithError(formFieldErrors);
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    this.disableButton();

    this.props.updateParameters(
      this.props.currentPlanName,
      this._filterFormData(this._jsonParseFormData(formData)),
      Object.keys(this.refs.parameterConfigurationForm.inputs),
      this.props.parentPath
    );
  }

  render() {
    return (
      <Formsy.Form ref="parameterConfigurationForm"
                   role="form"
                   className="form form-horizontal"
                   onSubmit={this.handleSubmit.bind(this)}
                   onValid={this.enableButton.bind(this)}
                   onInvalid={this.disableButton.bind(this)}>

        <div className="modal-body">
          <Loader height={60}
                  loaded={!this.props.isFetching}>
            <div className="tab-content">
              <div className="tab-pane active">
                <ModalFormErrorList errors={this.props.formErrors.toJS()}/>
                <ParameterInputList parameters={this.props.parameters}
                               mistralParameters={this.props.mistralParameters}/>
              </div>
            </div>
          </Loader>
        </div>

        <div className="modal-footer">
          <button type="submit" disabled={!this.state.canSubmit}
                  className="btn btn-primary">
            Save Changes
          </button>
          <Link to="/deployment-plan" type="button" className="btn btn-default" >
            Cancel
          </Link>
        </div>
      </Formsy.Form>
    );
  }
}
Parameters.propTypes = {
  currentPlanName: React.PropTypes.string,
  fetchParameters: React.PropTypes.func,
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  history: React.PropTypes.object,
  isFetching: React.PropTypes.bool,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map,
  parentPath: React.PropTypes.string.isRequired,
  updateParameters: React.PropTypes.func
};

Parameters.defaultProps = {
  parentPath: '/deployment-plan'
};

function mapStateToProps(state) {
  return {
    form: state.parameters.form,
    formErrors: state.parameters.form.get('formErrors'),
    formFieldErrors: state.parameters.form.get('formFieldErrors'),
    isFetching: state.parameters.isFetching,
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRootParameters(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(Parameters);
