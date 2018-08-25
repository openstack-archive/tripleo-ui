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
import { file } from 'redux-form-validators';

import HorizontalStaticText from '../ui/forms/HorizontalStaticText';
import HorizontalDirectoryInput, {
  validateDirectoryInput
} from '../ui/reduxForm/HorizontalDirectoryInput';
import HorizontalFileInput from '../ui/reduxForm/HorizontalFileInput';
import PlanUploadTypeRadios from './PlanUploadTypeRadios';
import TabPane from '../ui/TabPane';

const messages = defineMessages({
  planFiles: {
    id: 'EditPlanFieldsTab.planFiles',
    defaultMessage: 'Plan Files'
  },
  planName: {
    id: 'EditPlanFieldsTab.planName',
    defaultMessage: 'Plan Name'
  },
  directoryInputDescription: {
    id: 'EditPlanFieldsTab.directoryInputDescription',
    defaultMessage:
      'Provide a directory with files you want to update, the directory structure must map the plan directory structure.'
  },
  planTarball: {
    id: 'PlanFormTabs.planTarball',
    defaultMessage: 'Plan Tarball'
  },
  tarballInputDescription: {
    id: 'PlanFieldsTab.tarballInputDescription',
    defaultMessage:
      'Provided tarball must not contain root directory, when creating the tarball use following command: {command}'
  }
});

const PlanFieldsTab = ({
  active,
  intl: { formatMessage },
  planName,
  planUploadType
}) => (
  <TabPane isActive={active}>
    <HorizontalStaticText
      title={formatMessage(messages.planName)}
      text={planName}
      inputColumnClasses="col-sm-7"
      labelColumnClasses="col-sm-3"
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
  planName: PropTypes.string.isRequired,
  planUploadType: PropTypes.string.isRequired
};
PlanFieldsTab.defaultProps = { active: false };

export default injectIntl(PlanFieldsTab);
