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

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon, Button } from 'patternfly-react';
import { submit, isSubmitting, isPristine, isInvalid } from 'redux-form';

import { CloseModalButton } from '../ui/Modals';

const messages = defineMessages({
  back: {
    id: 'ContainerImagePrepareParameterFormActions.back',
    defaultMessage: 'Back'
  },
  save: {
    id: 'ContainerImagePrepareParameterFormActions.save',
    defaultMessage: 'Save Changes'
  },
  close: {
    id: 'ContainerImagePrepareParameterFormActions.close',
    defaultMessage: 'Close'
  }
});

const ContainerImagePrepareParameterFormActions = ({
  goBack,
  isSubmitting,
  isInvalid,
  isPristine,
  submitForm
}) => (
  <Fragment>
    <Button bsStyle="default" onClick={goBack} disabled={isSubmitting}>
      <Icon type="fa" name="angle-left" />
      <FormattedMessage {...messages.back} />
    </Button>
    <Button
      bsStyle="primary"
      onClick={submitForm}
      disabled={isSubmitting || isPristine || isInvalid}
    >
      <FormattedMessage {...messages.save} />
    </Button>
    <CloseModalButton>
      <FormattedMessage {...messages.close} />
    </CloseModalButton>
  </Fragment>
);
ContainerImagePrepareParameterFormActions.propTypes = {
  goBack: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isInvalid: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  submitForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isSubmitting: isSubmitting('parametersForm')(state),
  isPristine: isPristine('parametersForm')(state),
  isInvalid: isInvalid('parametersForm')(state)
});

const mapDispatchToProps = dispatch => ({
  submitForm: () => dispatch(submit('parametersForm'))
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    ContainerImagePrepareParameterFormActions
  )
);
