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

import { Button } from 'react-bootstrap';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { ModalBody, ModalFooter } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import { CloseModalButton } from '../ui/Modals';
import FormErrorList from '../ui/forms/FormErrorList';

const messages = defineMessages({
  confirm: {
    id: 'SelectRolesDialog.confirm',
    defaultMessage: 'Confirm Selection'
  },
  cancel: {
    id: 'SelectRolesDialog.cancel',
    defaultMessage: 'Cancel'
  }
});

class SelectRolesForm extends React.Component {
  render() {
    const { children, error, handleSubmit, invalid, pristine } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <FormErrorList errors={error ? [error] : []} />
          {children}
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={invalid || pristine}
            bsStyle="primary"
            type="submit"
          >
            <FormattedMessage {...messages.confirm} />
          </Button>
          <CloseModalButton>
            <FormattedMessage {...messages.cancel} />
          </CloseModalButton>
        </ModalFooter>
      </form>
    );
  }
}
SelectRolesForm.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string.isRequired,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired
};

const form = reduxForm({
  enableReinitialize: true,
  form: 'selectRoles',
  keepDirtyOnReinitialize: true
});

export default injectIntl(form(SelectRolesForm));
