import * as _ from 'lodash';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import EnvironmentConfigurationActions from '../../actions/EnvironmentConfigurationActions';
import EnvironmentConfigurationTopic from './EnvironmentConfigurationTopic';
import FormErrorList from '../ui/forms/FormErrorList';
import Loader from '../ui/Loader';
import Tab from '../ui/Tab';
import TabPane from '../ui/TabPane';

class EnvironmentConfiguration extends React.Component {

  constructor() {
    super();
    this.state = {
      canSubmit: false,
      activeTab: undefined
    };
  }

  componentDidMount() {
    this.props.fetchEnvironmentConfiguration(this.props.currentPlanName, this.props.parentPath);
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
    this.refs.environmentConfigurationForm.updateInputsWithError(formFieldErrors);
  }

  /*
  * Formsy splits data into objects by '.', file names include '.'
  * so we need to convert data back to e.g. { filename.yaml: true, ... }
  */
  _convertFormData(formData) {
    return _.mapValues(_.mapKeys(formData, (value, key) => {
      return key+'.yaml';
    }), (value) => {
      return value.yaml;
    });
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    const data = this._convertFormData(formData);
    const formFields = Object.keys(this.refs.environmentConfigurationForm.inputs);
    this.disableButton();
    this.props.updateEnvironmentConfiguration(
      this.props.currentPlanName,
      data,
      formFields,
      this.props.parentPath
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
    let topics = this.props.environmentConfigurationTopics.toArray().map((topic, index) => {
      let tabName = _.camelCase(topic.get('title'));
      return (
        <TabPane isActive={this.isTabActive(tabName)}
                 key={index}>
          <EnvironmentConfigurationTopic key={index}
                                         title={topic.get('title')}
                                         description={topic.get('description')}
                                         environmentGroups={topic.get('environment_groups')}/>
        </TabPane>
      );
    });

    let topicTabs = this.props.environmentConfigurationTopics.toArray().map((topic, index) => {
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
      <Formsy.Form ref="environmentConfigurationForm"
                   role="form"
                   className="form"
                   onSubmit={this.handleSubmit.bind(this)}
                   onValid={this.enableButton.bind(this)}
                   onInvalid={this.disableButton.bind(this)}>
        <div className="container-fluid">
          <Loader height={60}
                  loaded={this.props.isLoaded}>
            <FormErrorList errors={this.props.formErrors.toJS()}/>
            <div className="row row-eq-height">
              <div className="col-sm-4 sidebar-pf sidebar-pf-left">
                <ul className="nav nav-pills nav-stacked nav-arrows">
                  {topicTabs}
                </ul>
              </div>
              <div className="col-sm-8">
                <div className="tab-content">
                  {topics}
                </div>
              </div>
            </div>
          </Loader>
        </div>

        <div className="modal-footer">
          <button type="submit" disabled={!this.state.canSubmit}
                  className="btn btn-primary">
            Save Changes
          </button>
          <Link to={this.props.parentPath} type="button" className="btn btn-default" >
            Cancel
          </Link>
        </div>
      </Formsy.Form>
    );
  }
}
EnvironmentConfiguration.propTypes = {
  currentPlanName: React.PropTypes.string,
  environmentConfigurationTopics: ImmutablePropTypes.list.isRequired,
  fetchEnvironmentConfiguration: React.PropTypes.func,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  isLoaded: React.PropTypes.bool,
  location: React.PropTypes.object,
  parentPath: React.PropTypes.string.isRequired,
  updateEnvironmentConfiguration: React.PropTypes.func
};

EnvironmentConfiguration.defaultProps = {
  parentPath: '/deployment-plan'
};

function mapStateToProps(state) {
  return {
    currentPlanName: state.plans.get('currentPlanName'),
    environmentConfigurationTopics: state.environmentConfiguration.topics,
    formErrors: state.environmentConfiguration.getIn(['form', 'formErrors']),
    formFieldErrors: state.environmentConfiguration.getIn(['form', 'formFieldErrors']),
    isLoaded: state.environmentConfiguration.isLoaded
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEnvironmentConfiguration: planName => {
      dispatch(EnvironmentConfigurationActions.fetchEnvironmentConfiguration(planName));
    },
    updateEnvironmentConfiguration: (planName, data, parentPath) => {
      dispatch(EnvironmentConfigurationActions.updateEnvironmentConfiguration(
        planName, data, parentPath
      ));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentConfiguration);

/**
* requiresEnvironments validation
* Invalidates input if it is selected and environment it requires is not.
* example: validations="requiredEnvironments:['some_environment.yaml']"
*/
Formsy.addValidationRule('requiresEnvironments',
                         function (values, value, requiredEnvironmentFieldNames) {
                           if (value) {
                             return !_.filter(
                               _.values(
                                 _.pick(values, requiredEnvironmentFieldNames)
                               ), function(val){return val === false;}).length;
                           }
                           return true;
                         });
