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

import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup, ControlLabel, Col } from 'patternfly-react';
import { Field } from 'redux-form';

import Radio from '../ui/reduxForm/Radio';

const messages = defineMessages({
  directory: {
    id: 'PlanUploadTypeRadios.localDirectory',
    defaultMessage: 'Local Directory'
  },
  tarball: {
    id: 'PlanUploadTypeRadios.tarArchive',
    defaultMessage: 'Tar Archive (.tar.gz or .tgz)'
  },
  uploadType: {
    id: 'PlanUploadTypeRadios.uploadType',
    defaultMessage: 'Upload Type'
  }
});

const PlanUploadTypeRadios = ({ labelColumns, inputColumns }) => (
  <FormGroup controlId="planUploadType">
    <Col componentClass={ControlLabel} sm={labelColumns}>
      <FormattedMessage {...messages.uploadType} />
    </Col>
    <Col sm={inputColumns}>
      <Field
        name="planUploadType"
        component={Radio}
        type="radio"
        value="tarball"
      >
        <FormattedMessage {...messages.tarball} />
      </Field>
      <Field
        name="planUploadType"
        component={Radio}
        type="radio"
        value="directory"
      >
        <FormattedMessage {...messages.directory} />
      </Field>
    </Col>
  </FormGroup>
);

PlanUploadTypeRadios.propTypes = {
  inputColumns: PropTypes.number.isRequired,
  labelColumns: PropTypes.number.isRequired
};
PlanUploadTypeRadios.defaultProps = {
  inputColumns: 7,
  labelColumns: 3
};

export default PlanUploadTypeRadios;
