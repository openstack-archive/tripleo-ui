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

import cx from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import { InlineLoader } from '../ui/Loader';

const messages = defineMessages({
  new: {
    id: 'ValidationsToggle.new',
    defaultMessage: 'New Validations'
  },
  running: {
    id: 'ValidationsToggle.running',
    defaultMessage: 'Running Validations'
  },
  success: {
    id: 'ValidationsToggle.success',
    defaultMessage: 'Successful Validations'
  },
  failed: {
    id: 'ValidationsToggle.failed',
    defaultMessage: 'Failed Validations'
  },
  warning: {
    id: 'ValidationsToggle.warning',
    defaultMessage: 'Validations with Warning'
  },
  paused: {
    id: 'ValidationsToggle.paused',
    defaultMessage: 'Paused Validations'
  },
  error: {
    id: 'ValidationsToggle.error',
    defaultMessage: 'Validation Errors'
  },
  loadingValidations: {
    id: 'ValidationsToggle.loadingValidations',
    defaultMessage: 'Loading Validations...'
  }
});

const getIcon = status => {
  if (status === 'running') {
    return <InlineLoader inverse />;
  } else {
    return (
      <span
        className={cx({
          'fa fa-play-circle text-info': status === 'new',
          'pficon pficon-ok': status === 'success',
          'pficon pficon-error-circle-o': status === 'failed',
          'pficon pficon-warning-triangle-o': status === 'warning',
          'pficon pficon-paused text-info': status === 'paused',
          'pficon pficon-help text-error': status === 'error'
        })}
      />
    );
  }
};

const ValidationsToggle = ({
  executionsLoaded,
  intl: { formatMessage },
  showValidations,
  toggleValidations,
  validationStatusCounts,
  validationsLoaded
}) => (
  <li className="validations-toggle">
    <a className="link" onClick={toggleValidations}>
      <InlineLoader
        loaded={executionsLoaded && validationsLoaded}
        content={formatMessage(messages.loadingValidations)}
        inverse
      >
        {validationStatusCounts.keySeq().map(status => (
          <span key={status} title={formatMessage(messages[status])}>
            {getIcon(status)} {validationStatusCounts.get(status)}
            {' '}
          </span>
        ))}
      </InlineLoader>
    </a>
  </li>
);
ValidationsToggle.propTypes = {
  executionsLoaded: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  showValidations: PropTypes.bool.isRequired,
  toggleValidations: PropTypes.func.isRequired,
  validationStatusCounts: ImmutablePropTypes.map.isRequired,
  validationsLoaded: PropTypes.bool.isRequired
};

export default injectIntl(ValidationsToggle);
