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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { formValueSelector } from 'redux-form';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import Tab from '../ui/Tab';
import EditPlanFieldsTab from './EditPlanFieldsTab';
import PlanFilesTab from './PlanFilesTab';

const messages = defineMessages({
  files: {
    id: 'EditPlanFormTabs.files',
    defaultMessage: 'Files'
  },
  updatePlan: {
    id: 'EditPlanFormTabs.updatePlan',
    defaultMessage: 'Update Plan'
  }
});

class EditPlanFormTabs extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'editPlan'
    };
  }

  setActiveTab(tabName) {
    this.setState({ activeTab: tabName });
  }

  isActiveTab(tabName) {
    return this.state.activeTab === tabName;
  }

  getFilesCount() {
    const { files, planFiles } = this.props;
    return planFiles.union(files.map(file => file.filePath)).size;
  }

  render() {
    const { files, planFiles, planUploadType } = this.props;
    return (
      <div>
        <ul className="nav nav-tabs">
          <Tab isActive={this.isActiveTab('editPlan')}>
            <a className="link" onClick={() => this.setActiveTab('editPlan')}>
              <FormattedMessage {...messages.updatePlan} />
            </a>
          </Tab>
          <Tab isActive={this.isActiveTab('planFiles')}>
            <a className="link" onClick={() => this.setActiveTab('planFiles')}>
              <FormattedMessage {...messages.files} />{' '}
              <span className="badge">{this.getFilesCount()}</span>
            </a>
          </Tab>
        </ul>
        <div className="tab-content">
          <EditPlanFieldsTab
            active={this.isActiveTab('editPlan')}
            planName={this.props.planName}
            planUploadType={planUploadType}
          />
          <PlanFilesTab
            active={this.isActiveTab('planFiles')}
            planFiles={planFiles}
            selectedFiles={files}
          />
        </div>
      </div>
    );
  }
}
EditPlanFormTabs.propTypes = {
  files: PropTypes.array.isRequired,
  planFiles: ImmutablePropTypes.set.isRequired,
  planName: PropTypes.string.isRequired,
  planUploadType: PropTypes.string.isRequired
};
EditPlanFormTabs.defaultProps = {
  currentTtab: 'editPlan'
};

const selector = formValueSelector('editPlanForm');

const mapStateToProps = state => selector(state, 'planUploadType', 'files');

export default injectIntl(connect(mapStateToProps)(EditPlanFormTabs));
