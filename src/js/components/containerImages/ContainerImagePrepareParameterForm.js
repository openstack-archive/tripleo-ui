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
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Wizard } from 'patternfly-react';
import yaml from 'js-yaml';

import { OverlayLoader } from '../ui/Loader';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import AceEditorInput from '../ui/reduxForm/AceEditorInput';
import { updateParameters } from '../../actions/ParametersActions';

const messages = defineMessages({
  updatingConfiguration: {
    id: 'ContainerImagePrepareParameterForm.updatingConfiguration',
    defaultMessage: 'Updating configuration...'
  },
  yamlSyntaxError: {
    id: 'ContainerImagePrepareParameterForm.yamlSyntaxError',
    defaultMessage: 'Invalid Yaml Syntax:'
  }
});

const ContainerImagePrepareParameterForm = ({
  currentPlanName,
  error,
  handleSubmit,
  intl: { formatMessage },
  parameter,
  submitting
}) => (
  <Form onSubmit={handleSubmit} horizontal>
    <OverlayLoader
      loaded={!submitting}
      content={formatMessage(messages.updatingConfiguration)}
    >
      <ModalFormErrorList errors={error ? [error] : []} />
      <Wizard.Row>
        <Wizard.Main style={{ padding: 0 }}>
          <Wizard.Contents stepIndex={1} activeStepIndex={1}>
            <Field
              width="100%"
              height="687px"
              name={parameter.name}
              component={AceEditorInput}
              description={parameter.description}
            />
          </Wizard.Contents>
        </Wizard.Main>
      </Wizard.Row>
    </OverlayLoader>
  </Form>
);
ContainerImagePrepareParameterForm.propTypes = {
  currentPlanName: PropTypes.string.isRequired,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  parameter: ImmutablePropTypes.record.isRequired,
  submitting: PropTypes.bool.isRequired
};

const form = reduxForm({
  form: 'parametersForm',
  onSubmit: (
    { ContainerImagePrepare },
    dispatch,
    { currentPlanName, intl: { formatMessage } }
  ) => {
    try {
      ContainerImagePrepare = yaml.safeLoad(ContainerImagePrepare, {
        json: true
      });
      dispatch(updateParameters(currentPlanName, { ContainerImagePrepare }));
    } catch (e) {
      return Promise.reject(
        new SubmissionError({
          _error: {
            title: formatMessage(messages.yamlSyntaxError),
            message: e.message
          }
        })
      );
    }
  },
  validate: ({ ContainerImagePrepare }) => {
    try {
      yaml.safeLoad(ContainerImagePrepare, { json: true });
      return {};
    } catch (e) {
      return { ContainerImagePrepare: e.message };
    }
  }
});

export default injectIntl(form(ContainerImagePrepareParameterForm));
