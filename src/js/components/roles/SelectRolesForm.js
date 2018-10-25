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
import { pickBy } from 'lodash';
import { OverlayLoader } from '../ui/Loader';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button } from 'patternfly-react';

import { CloseModalButton } from '../ui/Modals';
import { CardGridFluid } from '../ui/cards';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';

const messages = defineMessages({
  saveChanges: {
    id: 'SelectRolesForm.saveChanges',
    defaultMessage: 'Save Changes'
  },
  cancel: {
    id: 'SelectRolesForm.cancel',
    defaultMessage: 'Cancel'
  },
  updatingRoles: {
    id: 'SelectRolesForm.updatingRoles',
    defaultMessage: 'Updating Roles...'
  },
  primaryRoleValidationError: {
    id: 'SelectRolesForm.primaryRoleValidationError',
    defaultMessage:
      'Please select one role tagged as "primary" and "controller"'
  }
});

const SelectRolesForm = ({
  children,
  error,
  handleSubmit,
  invalid,
  intl: { formatMessage },
  pristine,
  submitting
}) => (
  <form className="flex-container" onSubmit={handleSubmit}>
    <OverlayLoader
      loaded={!submitting}
      content={formatMessage(messages.updatingRoles)}
      containerClassName="flex-container"
    >
      <ModalFormErrorList errors={error ? [error] : []} />
      <CardGridFluid className="flex-column" matchHeight>
        {children}
      </CardGridFluid>
    </OverlayLoader>
    <Modal.Footer>
      <CloseModalButton>
        <FormattedMessage {...messages.cancel} />
      </CloseModalButton>
      <Button
        disabled={invalid || pristine || submitting}
        bsStyle="primary"
        type="submit"
      >
        <FormattedMessage {...messages.saveChanges} />
      </Button>
    </Modal.Footer>
  </form>
);
SelectRolesForm.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string.isRequired,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired
};

const validateForm = (values, { availableRoles, intl: { formatMessage } }) => {
  const errors = {};
  const selectedRoleNames = Object.keys(pickBy(values));
  const selectedRoles = availableRoles.filter((r, k) =>
    selectedRoleNames.includes(k)
  );
  if (!selectedRoles.some(r => r.tags.includes('primary'))) {
    errors._error = {
      message: formatMessage(messages.primaryRoleValidationError)
    };
  }
  return errors;
};

const form = reduxForm({
  form: 'selectRoles',
  validate: validateForm
});

export default injectIntl(form(SelectRolesForm));
