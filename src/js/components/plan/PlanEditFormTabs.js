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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import React, { PropTypes } from 'react';

import HorizontalStaticText from '../ui/forms/HorizontalStaticText';
import NavTab from '../ui/NavTab';
import PlanFileInput from './PlanFileInput';
import PlanFilesTab from './PlanFilesTab';
import PlanUploadTypeRadios from './PlanUploadTypeRadios';

const messages = defineMessages({
  files: {
    id: 'PlanEditFormTabs.files',
    defaultMessage: 'Files'
  },
  planName: {
    id: 'PlanEditFormTabs.planName',
    defaultMessage: 'Plan Name'
  },
  updatePlan: {
    id: 'PlanEditFormTabs.updatePlan',
    defaultMessage: 'Update Plan'
  },
  uploadFiles: {
    id: 'PlanEditFormTabs.uploadFiles',
    defaultMessage: 'Upload Files'
  },
  uploadType: {
    id: 'PlanEditFormTabs.uploadType',
    defaultMessage: 'Upload Type'
  }
});

export default class PlanEditFormTabs extends React.Component {
  setActiveTab(tabName) {
    return this.props.currentTab === tabName ? 'active' : '';
  }

  getFileCount() {
    let planFiles = this.props.planFiles || List();
    let selectedFiles = this.props.selectedFiles || [];
    return selectedFiles.length > planFiles.size
      ? selectedFiles.length
      : planFiles.size;
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <NavTab to={`/plans/${this.props.planName}/edit`}
                  query={{tab: 'editPlan'}}><FormattedMessage {...messages.updatePlan}/></NavTab>
          <NavTab to={`/plans/${this.props.planName}/edit`}
                  query={{tab: 'planFiles'}}>
            <FormattedMessage {...messages.files}/> <span className="badge">
            {this.getFileCount.bind(this)()}</span>
          </NavTab>
        </ul>
        <div className="tab-content">
          <PlanFormTab active={this.setActiveTab('editPlan')}
                       planName={this.props.planName}
                       uploadType={this.props.uploadType}
                       setUploadType={this.props.setUploadType}/>
          <PlanFilesTab active={this.setActiveTab('planFiles')}
                        planFiles={this.props.planFiles}
                        selectedFiles={this.props.selectedFiles}/>
        </div>
      </div>
    );
  }
}
PlanEditFormTabs.propTypes = {
  currentTab: PropTypes.string,
  planFiles: ImmutablePropTypes.map,
  planName: PropTypes.string,
  selectedFiles: PropTypes.array,
  setUploadType: PropTypes.func.isRequired,
  uploadType: PropTypes.string.isRequired
};
PlanEditFormTabs.defaultProps = {
  currentTtab: 'editPlan'
};

class _PlanFormTab extends React.Component {

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className={`tab-pane ${this.props.active}`}>
        <HorizontalStaticText title={formatMessage(messages.planName)}
                              text={this.props.planName}
                              valueColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"/>
        <PlanUploadTypeRadios title={formatMessage(messages.uploadType)}
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"
                              setUploadType={this.props.setUploadType}
                              uploadType={this.props.uploadType}/>
        <PlanFileInput name="planFiles"
                       title={this.props.intl.formatMessage(messages.uploadFiles)}
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
  planName: PropTypes.string,
  setUploadType: PropTypes.func.isRequired,
  uploadType: PropTypes.string.isRequired
};
const PlanFormTab = injectIntl(_PlanFormTab);
