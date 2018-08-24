/**
 * Copyright 2018 Red Hat Inc.
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

import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { format, file } from 'redux-form-validators';

import HorizontalInput from '../ui/reduxForm/HorizontalInput';
import HorizontalFileInput from '../ui/reduxForm/HorizontalFileInput';
import HorizontalDirectoryInput, {
  validateDirectoryInput
} from '../ui/reduxForm/HorizontalDirectoryInput';
import TabPane from '../ui/TabPane';
import PlanUploadTypeRadios from './PlanUploadTypeRadios';

const messages = defineMessages({
  addPlanName: {
    id: 'PlanFormTabs.addPlanName',
    defaultMessage: 'Add a Plan Name',
    description: 'Tooltip for "Plan Name" form field'
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
    defaultMessage:
      'Please use only lowercase alphanumeric characters and hyphens (-).'
  },
  planTarball: {
    id: 'PlanFormTabs.planTarball',
    defaultMessage: 'Plan Tarball'
  },
  tarballInputDescription: {
    id: 'PlanFieldsTab.tarballInputDescription',
    defaultMessage:
      'Provided tarball must not contain root directory, when creating the tarball use following command: {command}'
  },
  directoryInputDescription: {
    id: 'PlanFieldsTab.directoryInputDescription',
    defaultMessage:
      'Provide a directory of Heat templates which defines a deployment plan.'
  }
});

const PlanFieldsTab = ({ active, intl: { formatMessage }, planUploadType }) => (
  <TabPane isActive={active}>
    <Field
      id="planName"
      component={HorizontalInput}
      name="planName"
      label={formatMessage(messages.planName)}
      labelColumns={3}
      placeholder={formatMessage(messages.addPlanName)}
      validate={format({
        with: /^[a-z][a-z0-9-]+$/,
        message: formatMessage(messages.planNameValidationError)
      })}
      required
    />
    <PlanUploadTypeRadios />
    {planUploadType === 'directory' && (
      <Field
        id="files"
        name="files"
        component={HorizontalDirectoryInput}
        label={formatMessage(messages.planFiles)}
        labelColumns={3}
        validate={validateDirectoryInput}
        description={formatMessage(messages.directoryInputDescription)}
        required
      />
    )}
    {planUploadType === 'tarball' && (
      <Field
        id="tarball"
        name="tarball"
        component={HorizontalFileInput}
        type="file"
        label={formatMessage(messages.planTarball)}
        labelColumns={3}
        validate={file({ accept: 'application/x-gzip, application/gzip' })}
        description={
          <FormattedMessage
            {...messages.tarballInputDescription}
            values={{
              command: (
                <code style={{ whiteSpace: 'nowrap' }}>
                  tar -czf heat-templates.tar.gz -C tripleo-heat-templates/ .
                </code>
              )
            }}
          />
        }
        required
      />
    )}
  </TabPane>
);
PlanFieldsTab.propTypes = {
  active: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  planUploadType: PropTypes.string.isRequired
};
PlanFieldsTab.defaultProps = { active: false };

export default injectIntl(PlanFieldsTab);
