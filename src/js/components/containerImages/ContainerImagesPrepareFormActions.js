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

import { startContainerImagesPrepare } from '../../actions/ContainerImagesActions';

const messages = defineMessages({
  next: {
    id: 'ContainerImagesWizard.next',
    defaultMessage: 'Next'
  },
  reset: {
    id: 'ContainerImagesPrepareFormActions.reset',
    defaultMessage: 'Reset to defaults'
  }
});

const ContainerImagesPrepareFormActions = ({
  isSubmitting,
  isInvalid,
  isPristine,
  resetToDefaults,
  submitImagesPrepareForm
}) => (
  <Fragment>
    <Button onClick={resetToDefaults} disabled={isSubmitting}>
      <FormattedMessage {...messages.reset} />
    </Button>
    <Button
      bsStyle="primary"
      onClick={submitImagesPrepareForm}
      disabled={isSubmitting || isPristine || isInvalid}
    >
      <FormattedMessage {...messages.next} />
      <Icon type="fa" name="angle-right" />
    </Button>
  </Fragment>
);
ContainerImagesPrepareFormActions.propTypes = {
  intl: PropTypes.object.isRequired,
  isFetchingParameters: PropTypes.bool.isRequired,
  isInvalid: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  resetToDefaults: PropTypes.func.isRequired,
  submitImagesPrepareForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFetchingParameters: state.parameters.isFetching,
  isSubmitting: isSubmitting('containerImagesPrepareForm')(state),
  isPristine: isPristine('containerImagesPrepareForm')(state),
  isInvalid: isInvalid('containerImagesPrepareForm')(state)
});

const mapDispatchToProps = dispatch => ({
  resetToDefaults: () => dispatch(startContainerImagesPrepare({})),
  submitImagesPrepareForm: () => dispatch(submit('containerImagesPrepareForm'))
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    ContainerImagesPrepareFormActions
  )
);
