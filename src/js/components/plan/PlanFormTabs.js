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

import ClassNames from 'classnames';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { addValidationRule } from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalInput from '../ui/forms/HorizontalInput';
import Tab from '../ui/Tab';
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
  },
  badExtension: {
    id: 'PlanFormTabs.badExtension',
    defaultMessage:
      'Invalid type: plan file must be a tar archive (.tar.gz or .tgz)'
  }
});

export default class PlanFormTabs extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'newPlan'
    };
  }

  setActiveTab(tabName) {
    this.setState({ activeTab: tabName });
  }

  isActiveTab(tabName) {
    return this.state.activeTab === tabName;
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <Tab isActive={this.isActiveTab('newPlan')}>
            <a className="link" onClick={() => this.setActiveTab('newPlan')}>
              <FormattedMessage {...messages.newPlan} />
            </a>
          </Tab>
          <Tab isActive={this.isActiveTab('planFiles')}>
            <a className="link" onClick={() => this.setActiveTab('planFiles')}>
              <FormattedMessage {...messages.files} />{' '}
              <span className="badge">{this.props.selectedFiles.length}</span>
            </a>
          </Tab>
        </ul>
        <div className="tab-content">
          <PlanFormTab
            active={this.isActiveTab('newPlan')}
            uploadType={this.props.uploadType}
            setUploadType={this.props.setUploadType}
          />
          <PlanFilesTab
            active={this.isActiveTab('planFiles')}
            selectedFiles={this.props.selectedFiles}
          />
        </div>
      </div>
    );
  }
}
PlanFormTabs.propTypes = {
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
      <div
        className={ClassNames({ 'tab-pane': true, active: this.props.active })}
      >
        <HorizontalInput
          name="planName"
          title={formatMessage(messages.planName)}
          inputColumnClasses="col-sm-7"
          labelColumnClasses="col-sm-3"
          placeholder={formatMessage(messages.addPlanName)}
          validations={{ matchRegexp: /^[A-Za-z0-9-]+$/ }}
          validationError={formatMessage(messages.planNameValidationError)}
          required
        />
        <PlanUploadTypeRadios
          title={formatMessage(messages.uploadType)}
          inputColumnClasses="col-sm-7"
          labelColumnClasses="col-sm-3"
          setUploadType={this.props.setUploadType}
          uploadType={this.props.uploadType}
        />
        <PlanFileInput
          name="planFiles"
          title={formatMessage(messages.planFiles)}
          inputColumnClasses="col-sm-7"
          labelColumnClasses="col-sm-3"
          uploadType={this.props.uploadType}
          validations="tarballValidator"
          validationError={formatMessage(messages.badExtension)}
          multiple
          required
        />
      </div>
    );
  }
}
_PlanFormTab.propTypes = {
  active: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  setUploadType: PropTypes.func.isRequired,
  uploadType: PropTypes.string.isRequired
};
_PlanFormTab.defaultProps = { active: false };

const PlanFormTab = injectIntl(_PlanFormTab);

addValidationRule('tarballValidator', values => {
  let files = values['planFiles'];
  // If only one file was uploaded, it should be a tarball
  if (files !== undefined && files.length === 1) {
    if (!files[0].name.endsWith('.tar.gz') && !files[0].name.endsWith('.tgz')) {
      return false;
    }
  }
  return true;
});
