import * as _ from 'lodash';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import Loader from '../ui/Loader';
import ParametersActions from '../../actions/ParametersActions';
import ParameterTree from './ParameterTree';

class Parameters extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false
    };
  }

  componentDidMount() {
    this.props.fetchParameters(this.props.currentPlanName);
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  /**
  * Json parameter values are sent as string, this method parses those back to object
  */
  _jsonParseformData(formData) {
    return _.mapValues(formData, (value) => {
      try {
        return JSON.parse(value);
      } catch(e) {
        return value;
      }
    });
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    this.disableButton();

    this.props.updateParameters(
      this.props.currentPlanName,
      this._jsonParseformData(formData),
      Object.keys(this.refs.parameterConfigurationForm.inputs),
      this.props.parentPath
    );
  }

  render() {
    return (
      <div>
        <div className="modal modal-routed in" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <Formsy.Form ref="parameterConfigurationForm"
                           role="form"
                           className="form form-horizontal"
                           onSubmit={this.handleSubmit.bind(this)}
                           onValid={this.enableButton.bind(this)}
                           onInvalid={this.disableButton.bind(this)}>
              <div className="modal-header">
                <Link to={this.props.parentPath}
                      type="button"
                      className="close">
                  <span aria-hidden="true" className="pficon pficon-close"/>
                </Link>
                <h4 className="modal-title">Parameters Configuration</h4>
              </div>

              <Loader height={60}
                      loaded={!this.props.isPending}>
                <ParameterTree parameters={this.props.parameters}
                               formErrors={this.props.form.formErrors}/>
              </Loader>

              <div className="modal-footer">
                <button type="submit" disabled={!this.state.canSubmit}
                        className="btn btn-primary">
                  Save Configuration
                </button>
                <Link to={this.props.parentPath} type="button" className="btn btn-default" >
                  Cancel
                </Link>
              </div>
              </Formsy.Form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop in"></div>
      </div>
    );
  }
}
Parameters.propTypes = {
  currentPlanName: React.PropTypes.string,
  fetchParameters: React.PropTypes.func,
  form: ImmutablePropTypes.map,
  history: React.PropTypes.object,
  isPending: React.PropTypes.bool,
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
    isPending: state.parameters.isPending,
    parameters: state.parameters.parameters
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchParameters: currentPlanName => {
      dispatch(ParametersActions.fetchParameters(currentPlanName));
    },
    updateParameters: (currentPlanName, data, inputFields, url) => {
      dispatch(ParametersActions.updateParameters(currentPlanName, data, inputFields, url));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Parameters);
