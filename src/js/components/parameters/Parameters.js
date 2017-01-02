import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isObjectLike, mapValues } from 'lodash';
import { Link } from 'react-router';
import { fromJS, is } from 'immutable';
import React from 'react';

import Loader from '../ui/Loader';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import ParametersActions from '../../actions/ParametersActions';
import ParameterInputList from './ParameterInputList';
import { getRootParameters } from '../../selectors/parameters';

const messages = defineMessages({
  saveChanges: {
    id: 'Parameters.saveChanges',
    defaultMessage: 'Save Changes'
  },
  cancel: {
    id: 'Parameters.cancel',
    defaultMessage: 'Cancel'
  }
});

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
                  loaded={this.props.parametersLoaded}>
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
            <FormattedMessage {...messages.saveChanges}/>
          </button>
          <Link to="/deployment-plan" type="button" className="btn btn-default" >
            <FormattedMessage {...messages.cancel}/>
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
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map,
  parametersLoaded: React.PropTypes.bool,
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
    mistralParameters: state.parameters.mistralParameters,
    parameters: getRootParameters(state),
    parametersLoaded: state.parameters.loaded
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
