import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalInput from '../ui/forms/HorizontalInput';
import NavTab from '../ui/NavTab';
import PlanFileInput from './PlanFileInput';
import PlanFilesTab from './PlanFilesTab';
import PlanUploadTypeRadios from './PlanUploadTypeRadios';

const messages = defineMessages({
  addPlanName: {
    id: 'PlanFormTabs.addPlanName',
    defaultMessage: 'Add a Plan Name',
    description: 'Tooltip for "Plan Name" form field'
  },
  newPlan: {
    id: 'PlanFormTabs.newPlan',
    defaultMessage: 'New Plan'
  },
  files: {
    id: 'PlanFormTabs.files',
    defaultMessage: 'Files'
  },
  planFiles: {
    id: 'PlanFormTabs.planFiles',
    defaultMessage: 'Plan Files'
  },
  planName: {
    id: 'PlanFormTabs.planName',
    defaultMessage: 'Plan Name'
  },
  planNameValidationError: {
    id: 'PlanFormTabs.planNameValidationError',
    defaultMessage: 'Please use only alphanumeric characters and hyphens (-).'
  },
  uploadType: {
    id: 'PlanFormTabs.uploadType',
    defaultMessage: 'Upload Type'
  }
});

export default class PlanFormTabs extends React.Component {
  setActiveTab(tabName) {
    return this.props.currentTab === tabName ? 'active' : '';
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <NavTab to="/plans/new" query={{tab: 'newPlan'}}>
            <FormattedMessage {...messages.newPlan}/>
          </NavTab>
          <NavTab to="/plans/new" query={{tab: 'planFiles'}}>
            <FormattedMessage {...messages.files}/> <span className="badge">
            {this.props.selectedFiles.length}</span>
          </NavTab>
        </ul>
        <div className="tab-content">
          <PlanFormTab active={this.setActiveTab('newPlan')}
                       uploadType={this.props.uploadType}
                       setUploadType={this.props.setUploadType}/>
          <PlanFilesTab active={this.setActiveTab('planFiles')}
                        selectedFiles={this.props.selectedFiles} />
        </div>
      </div>
    );
  }
}
PlanFormTabs.propTypes = {
  currentTab: PropTypes.string,
  selectedFiles: PropTypes.array,
  setUploadType: PropTypes.func.isRequired,
  uploadType: PropTypes.string.isRequired
};
PlanFormTabs.defaultProps = {
  currentTtab: 'newPlan',
  selectedFiles: []
};

class _PlanFormTab extends React.Component {
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className={`tab-pane ${this.props.active}`}>
        <HorizontalInput name="planName"
                         title={formatMessage(messages.planName)}
                         inputColumnClasses="col-sm-7"
                         labelColumnClasses="col-sm-3"
                         placeholder={formatMessage(messages.addPlanName)}
                         validations={{matchRegexp: /^[A-Za-z0-9-]+$/}}
                         validationError={formatMessage(messages.planNameValidationError)}
                         required />
        <PlanUploadTypeRadios title={formatMessage(messages.uploadType)}
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"
                              setUploadType={this.props.setUploadType}
                              uploadType={this.props.uploadType}/>
        <PlanFileInput name="planFiles"
                       title={formatMessage(messages.planFiles)}
                       inputColumnClasses="col-sm-7"
                       labelColumnClasses="col-sm-3"
                       uploadType={this.props.uploadType}
                       multiple
                       required/>
      </div>
    );
  }
}
_PlanFormTab.propTypes = {
  active: PropTypes.string,
  intl: PropTypes.object,
  setUploadType: PropTypes.func.isRequired,
  uploadType: PropTypes.string.isRequired
};

const PlanFormTab = injectIntl(_PlanFormTab);
