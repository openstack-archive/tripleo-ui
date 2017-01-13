import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isObjectLike, mapValues } from 'lodash';
import { Link } from 'react-router';
import { fromJS, is } from 'immutable';
import React from 'react';

import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import EnvironmentParameters from './EnvironmentParameters';
import { getRootParameters } from '../../selectors/parameters';
import { getEnabledEnvironments } from '../../selectors/environmentConfiguration';
import Loader from '../ui/Loader';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import ParametersActions from '../../actions/ParametersActions';
import ParameterInputList from './ParameterInputList';
import Tab from '../ui/Tab';
import TabPane from '../ui/TabPane';

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
      canSubmit: false,
      selectedTab: 'general'
    };
  }

  componentDidMount() {
    this.props.fetchEnvironmentConfiguration(this.props.currentPlanName, this.props.parentPath);
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
    return fromJS(formData).filterNot((value, key) => {
      return is(fromJS(this.props.allParameters.get(key).default), value);
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
      Object.keys(this.refs.parameterConfigurationForm.inputs)
    );
  }

  selectTab(tabName) {
    this.setState({
      selectedTab: tabName
    });
  }

  renderTabs() {
    return this.props.enabledEnvironments.toList().map(environment => {
      return (
        <Tab key={environment.file}
             title={environment.description}
             isActive={environment.file === this.state.selectedTab}>
          <a className="link"
             onClick={this.selectTab.bind(this, environment.file)}>
             {environment.title}
          </a>
        </Tab>
      );
    });
  }

  renderTabPanes() {
    if (this.state.selectedTab === 'general') {
      return (
        <TabPane isActive>
          <ParameterInputList
            parameters={this.props.parameters.toList()}
            mistralParameters={this.props.mistralParameters}/>
        </TabPane>
      );
    } else {
      return this.props.enabledEnvironments.toList().map(environment => {
        return (
          <TabPane isActive={this.state.selectedTab === environment.file}
                   key={environment.file}
                   renderOnlyActive>
            <EnvironmentParameters environment={environment.file}/>
          </TabPane>
        );
      });
    }
  }

  render() {
    return (
      <Formsy.Form ref="parameterConfigurationForm"
        role="form"
        className="form form-horizontal"
        onSubmit={this.handleSubmit.bind(this)}
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}>

        <div className="container-fluid">
          <div className="row row-eq-height">
            <div className="col-sm-4 sidebar-pf sidebar-pf-left">
              <ul className="nav nav-pills nav-stacked nav-arrows">
                <Tab key="general"
                     title="General"
                     isActive={'general' === this.state.selectedTab}>
                  <a className="link" onClick={this.selectTab.bind(this, 'general')}>General</a>
                </Tab>
                <li className="spacer" />
                {this.renderTabs()}
              </ul>
            </div>
            <div className="col-sm-8">
              <Loader height={120}
                      content="Fetching Parameters..."
                      loaded={this.props.parametersLoaded}>
                <ModalFormErrorList errors={this.props.formErrors.toJS()}/>
                <div className="tab-content">
                  {this.renderTabPanes()}
                </div>
              </Loader>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="submit"
                  disabled={!this.state.canSubmit}
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
  allParameters: ImmutablePropTypes.map.isRequired,
  currentPlanName: React.PropTypes.string,
  enabledEnvironments: ImmutablePropTypes.map.isRequired,
  fetchEnvironmentConfiguration: React.PropTypes.func.isRequired,
  fetchParameters: React.PropTypes.func.isRequired,
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  history: React.PropTypes.object,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  parametersLoaded: React.PropTypes.bool,
  parentPath: React.PropTypes.string.isRequired,
  updateParameters: React.PropTypes.func
};

Parameters.defaultProps = {
  parentPath: '/deployment-plan'
};

function mapStateToProps(state, ownProps) {
  return {
    allParameters: state.parameters.parameters,
    enabledEnvironments: getEnabledEnvironments(state),
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
    fetchEnvironmentConfiguration: (currentPlanName, redirectPath) => {
      dispatch(EnvironmentConfigurationActions.fetchEnvironmentConfiguration(currentPlanName,
                                                                             redirectPath));
    },
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
