import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import React from 'react';

import common from '../../messages/common';
import HorizontalInput from '../ui/forms/HorizontalInput';
import NavTab from '../ui/NavTab';
import PlanFileInput from './PlanFileInput';
import PlanFilesTab from './PlanFilesTab';
import PlanUploadTypeRadios from './PlanUploadTypeRadios';

const messages = defineMessages({
  addPlanName: {
    id: 'PlanFormTabs.addPlanName',
    defaultMessage: 'Add a Plan Name'
  },
  newPlan: {
    id: 'PlanFormTabs.newPlan',
    defaultMessage: 'New Plan'
  },
  planNameValidationError: {
    id: 'PlanFormTabs.planNameValidationError',
    defaultMessage: 'Please use only alphanumeric characters and -'
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
            <FormattedMessage {...common.files}/> <span className="badge">
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
  currentTab: React.PropTypes.string,
  selectedFiles: React.PropTypes.array,
  setUploadType: React.PropTypes.func.isRequired,
  uploadType: React.PropTypes.string.isRequired
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
                         title={formatMessage(common.planName)}
                         inputColumnClasses="col-sm-7"
                         labelColumnClasses="col-sm-3"
                         placeholder={formatMessage(messages.addPlanName)}
                         validations={{matchRegexp: /^[A-Za-z0-9-]+$/}}
                         validationError={formatMessage(messages.planNameValidationError)}
                         required />
        <PlanUploadTypeRadios title={formatMessage(common.uploadType)}
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"
                              setUploadType={this.props.setUploadType}
                              uploadType={this.props.uploadType}/>
        <PlanFileInput name="planFiles"
                       title={formatMessage(common.planFiles)}
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
  active: React.PropTypes.string,
  intl: React.PropTypes.object,
  setUploadType: React.PropTypes.func.isRequired,
  uploadType: React.PropTypes.string.isRequired
};

const PlanFormTab = injectIntl(_PlanFormTab);
