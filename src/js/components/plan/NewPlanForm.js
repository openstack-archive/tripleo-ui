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

import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Form, Modal, Button } from 'patternfly-react';
import { reduxForm } from 'redux-form';

import { CloseModalButton } from '../ui/Modals';
import { OverlayLoader } from '../ui/Loader';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';

const messages = defineMessages({
  cancel: {
    id: 'NewPlanForm.cancel',
    defaultMessage: 'Cancel'
  },
  creatingDeploymentPlan: {
    id: 'NewPlanForm.creatingDeploymentPlan',
    defaultMessage: 'Creating deployment plan...'
  },
  uploadAndCreate: {
    id: 'NewPlan.uploadAndCreate',
    defaultMessage: 'Upload Files and Create Plan'
  }
});

const NewPlanForm = ({
  children,
  error,
  handleSubmit,
  intl: { formatMessage },
  invalid,
  pristine,
  submitting
}) => (
  <Form id="NewPlanForm__form" onSubmit={handleSubmit} horizontal>
    <OverlayLoader
      loaded={!submitting}
      content={formatMessage(messages.creatingDeploymentPlan)}
    >
      <ModalFormErrorList errors={error ? [error] : []} />
      <Modal.Body>{children}</Modal.Body>
    </OverlayLoader>
    <Modal.Footer>
      <CloseModalButton id="NewPlanForm__cancelCreatePlanButton">
        <FormattedMessage {...messages.cancel} />
      </CloseModalButton>
      <Button
        id="NewPlanForm_submitButton"
        type="submit"
        disabled={invalid || pristine || submitting}
        bsStyle="primary"
      >
        <FormattedMessage {...messages.uploadAndCreate} />
      </Button>
    </Modal.Footer>
  </Form>
);
NewPlanForm.propTypes = {
  children: PropTypes.node,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired
};

const form = reduxForm({
  form: 'newPlanForm',
  initialValues: {
    planUploadType: 'default',
    files: []
  }
});

export default injectIntl(form(NewPlanForm));
