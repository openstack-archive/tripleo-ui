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

import { Button, Form, ModalFooter } from 'react-bootstrap';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isEqual, pickBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import { CloseModalButton } from '../ui/Modals';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import { OverlayLoader } from '../ui/Loader';

const messages = defineMessages({
  cancel: {
    id: 'ParametersForm.cancel',
    defaultMessage: 'Cancel'
  },
  saveChanges: {
    id: 'ParametersForm.saveChanges',
    defaultMessage: 'Save Changes'
  },
  saveAndClose: {
    id: 'ParametersForm.saveAndClose',
    defaultMessage: 'Save And Close'
  },
  updatingParameters: {
    id: 'ParametersForm.updatingParameters',
    defaultMessage: 'Updating parameters'
  },
  enterValidJson: {
    id: 'ParametersForm.enterValidJson',
    defaultMessage: 'Please enter a valid JSON.'
  },
  invalidParameters: {
    id: 'ParametersForm.invalidParameters',
    defaultMessage: 'Some parameter values are invalid:',
    description: 'Form error notification title'
  },
  invalidParametersList: {
    id: 'ParametersForm.invalidParametersList',
    defaultMessage: '{parameters}',
    description: 'A list of invalid parameters in form error message'
  }
});

const ParametersForm = ({
  error,
  children,
  onSubmit,
  handleSubmit,
  intl: { formatMessage },
  invalid,
  pristine,
  submitting,
  initialValues
}) => (
  <Form onSubmit={handleSubmit} horizontal>
    <OverlayLoader
      loaded={!submitting}
      content={formatMessage(messages.updatingParameters)}
    >
      <ModalFormErrorList errors={error ? [error] : []} />
      {children}
    </OverlayLoader>
    <ModalFooter>
      <Button
        type="submit"
        disabled={invalid || pristine || submitting}
        bsStyle="primary"
      >
        <FormattedMessage {...messages.saveChanges} />
      </Button>
      <Button
        disabled={invalid || pristine || submitting}
        onClick={handleSubmit(values =>
          onSubmit({ ...values, saveAndClose: true })
        )}
      >
        <FormattedMessage {...messages.saveAndClose} />
      </Button>
      <CloseModalButton>
        <FormattedMessage {...messages.cancel} />
      </CloseModalButton>
    </ModalFooter>
  </Form>
);
ParametersForm.propTypes = {
  children: PropTypes.node,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  parameters: ImmutablePropTypes.map.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired
};

const isJSON = value => {
  try {
    // empty string is considered valid JSON type parameter value
    return value === '' ? true : !!JSON.parse(value);
  } catch (e) {
    return false;
  }
};

const validate = (
  values,
  { initialValues, parameters, intl: { formatMessage } }
) => {
  const errors = {};

  // Validate only parameters which were updated by User
  const updatedValues = pickBy(
    values,
    (value, key) => !isEqual(value, initialValues[key])
  );

  Object.keys(updatedValues).map(key => {
    if (parameters.getIn([key, 'type']).toLowerCase() === 'json') {
      if (!isJSON(values[key])) {
        errors[key] = formatMessage(messages.enterValidJson);
      }
    }
  });

  // Add global error message
  if (Object.keys(errors).length > 0) {
    errors['_error'] = {
      title: formatMessage(messages.invalidParameters),
      message: formatMessage(messages.invalidParametersList, {
        parameters: Object.keys(errors).join(', ')
      })
    };
  }
  return errors;
};

const form = reduxForm({
  form: 'parametersForm',
  validate
});

export default injectIntl(form(ParametersForm));
