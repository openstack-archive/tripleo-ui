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

import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import Tab from '../ui/Tab';
import PlanFieldsTab from './PlanFieldsTab';
import PlanFilesTab from './PlanFilesTab';

const messages = defineMessages({
  newPlan: {
    id: 'PlanFormTabs.newPlan',
    defaultMessage: 'New Plan'
  },
  files: {
    id: 'PlanFormTabs.files',
    defaultMessage: 'Files'
  }
});

class PlanFormTabs extends React.Component {
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
    const { isDirectoryUpload, files, planUploadType } = this.props;
    return (
      <div>
        <ul className="nav nav-tabs">
          <Tab isActive={this.isActiveTab('newPlan')}>
            <a className="link" onClick={() => this.setActiveTab('newPlan')}>
              <FormattedMessage {...messages.newPlan} />
            </a>
          </Tab>
          {isDirectoryUpload &&
            files.length > 0 && (
              <Tab isActive={this.isActiveTab('planFiles')}>
                <a
                  className="link"
                  onClick={() => this.setActiveTab('planFiles')}
                >
                  <FormattedMessage {...messages.files} />{' '}
                  <span className="badge">{files.length}</span>
                </a>
              </Tab>
            )}
        </ul>
        <div className="tab-content">
          <PlanFieldsTab
            active={this.isActiveTab('newPlan')}
            planUploadType={planUploadType}
          />
          <PlanFilesTab
            active={this.isActiveTab('planFiles')}
            selectedFiles={files}
          />
        </div>
      </div>
    );
  }
}
PlanFormTabs.propTypes = {
  files: PropTypes.array.isRequired,
  isDirectoryUpload: PropTypes.bool.isRequired,
  planUploadType: PropTypes.string.isRequired
};

const selector = formValueSelector('newPlanForm');

const mapStateToProps = state => {
  const { planUploadType, files } = selector(state, 'planUploadType', 'files');
  return {
    isDirectoryUpload: planUploadType === 'directory',
    planUploadType,
    files
  };
};

export default connect(mapStateToProps)(PlanFormTabs);
