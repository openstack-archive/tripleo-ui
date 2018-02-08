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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, ModalFooter } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';
import { pickBy } from 'lodash';

import { CloseModalButton } from '../ui/Modals';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import { OverlayLoader } from '../ui/Loader';

const messages = defineMessages({
  cancel: {
    id: 'EnvironmentConfigurationForm.cancel',
    defaultMessage: 'Cancel'
  },
  saveChanges: {
    id: 'EnvironmentConfigurationForm.saveChanges',
    defaultMessage: 'Save Changes'
  },
  saveAndClose: {
    id: 'EnvironmentConfigurationForm.saveAndClose',
    defaultMessage: 'Save And Close'
  },
  requiredEnvironments: {
    id: 'EnvironmentConfigurationForm.requiredEnvironments',
    defaultMessage: 'This option requires {requiredEnvironments} to be enabled.'
  },
  missingConfiguration: {
    id: 'EnvironmentConfigurationForm.missingConfiguration',
    defaultMessage: 'Missing configuration',
    description:
      'Title for general error message describing dependent environments need to be enabled'
  },
  requiredEnvironmentsGlobalError: {
    id: 'EnvironmentConfigurationForm.requiredEnvironmentGlobalError',
    defaultMessage:
      'Selected options depend on other options which are not enabled',
    description:
      'General error message describing dependent environments need to be enabled'
  },
  updatingEnvironmentConfiguration: {
    id: 'EnvironmentConfigurationForm.updatingEnvironmentConfiguration',
    defaultMessage: 'Updating Environment configuration'
  }
});

const EnvironmentConfigurationForm = ({
  children,
  error,
  onSubmit,
  handleSubmit,
  intl: { formatMessage },
  invalid,
  pristine,
  submitting,
  initialValues
}) => (
  <Form className="flex-container" onSubmit={handleSubmit} horizontal>
    <OverlayLoader
      loaded={!submitting}
      content={formatMessage(messages.updatingEnvironmentConfiguration)}
      containerClassName="flex-container"
    >
      <ModalFormErrorList errors={error ? [error] : []} />
      <div className="flex-row">{children}</div>
    </OverlayLoader>
    <ModalFooter>
      <CloseModalButton>
        <FormattedMessage {...messages.cancel} />
      </CloseModalButton>
      <Button
        disabled={invalid || pristine || submitting}
        onClick={handleSubmit(values =>
          onSubmit({ ...values, saveAndClose: true })
        )}
      >
        <FormattedMessage {...messages.saveAndClose} />
      </Button>
      <Button
        type="submit"
        disabled={invalid || pristine || submitting}
        bsStyle="primary"
      >
        <FormattedMessage {...messages.saveChanges} />
      </Button>
    </ModalFooter>
  </Form>
);
EnvironmentConfigurationForm.propTypes = {
  children: PropTypes.node,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired
};

const validate = (values, { allEnvironments, intl: { formatMessage } }) => {
  const errors = {};

  // Get array of environment files currently enabled in the form
  const enabledValues = Object.keys(pickBy(values)).map(v =>
    v.replace(':', '.')
  );

  // For each enabled environment, get its list of required environments. Add
  // error if some of them are not enabled
  enabledValues.map(e => {
    const requires = allEnvironments.getIn([e, 'requires']);

    if (
      !requires
        .toSet()
        .subtract(enabledValues)
        .isEmpty()
    ) {
      const requiredEnvironmentNames = requires
        .map(env => allEnvironments.getIn([env, 'title'], env))
        .toArray();

      errors[e.replace('.', ':')] = formatMessage(
        messages.requiredEnvironments,
        {
          requiredEnvironments: requiredEnvironmentNames
        }
      );
    }
  });

  // Add global error message
  if (Object.keys(errors).length > 0) {
    errors['_error'] = {
      title: formatMessage(messages.missingConfiguration),
      message: formatMessage(messages.requiredEnvironmentsGlobalError)
    };
  }
  return errors;
};

const form = reduxForm({
  form: 'environmentConfigurationForm',
  validate
});

export default injectIntl(form(EnvironmentConfigurationForm));
