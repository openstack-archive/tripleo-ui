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
import { defineMessages, injectIntl } from 'react-intl';
import { Field } from 'redux-form';

import HorizontalStaticText from '../ui/forms/HorizontalStaticText';
import HorizontalDirectoryInput, {
  validateDirectoryInput
} from '../ui/reduxForm/HorizontalDirectoryInput';
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
  }
});

const PlanFieldsTab = ({ active, intl: { formatMessage }, planName }) => (
  <TabPane isActive={active}>
    <HorizontalStaticText
      title={formatMessage(messages.planName)}
      text={planName}
      inputColumnClasses="col-sm-7"
      labelColumnClasses="col-sm-3"
    />
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
  </TabPane>
);
PlanFieldsTab.propTypes = {
  active: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  planName: PropTypes.string.isRequired
};
PlanFieldsTab.defaultProps = { active: false };

export default injectIntl(PlanFieldsTab);
