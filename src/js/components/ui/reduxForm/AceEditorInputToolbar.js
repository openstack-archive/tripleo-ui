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
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';

const AceEditorInputToolbar = ({
  valid,
  invalid,
  warning,
  error,
  description
}) => (
  <div className="ace-editor-toolbar">
    {invalid && (
      <Fragment>
        <Icon type="pf" name="error-circle-o" /> {error}
      </Fragment>
    )}
    {warning && (
      <Fragment>
        <Icon type="pf" name="warning-triangle-o" /> {warning}
      </Fragment>
    )}
    {valid &&
      !warning &&
      description && (
        <Fragment>
          <Icon type="pf" name="info" /> {description}
        </Fragment>
      )}
  </div>
);
AceEditorInputToolbar.propTypes = {
  description: PropTypes.string,
  error: PropTypes.string,
  invalid: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  warning: PropTypes.string
};

export default AceEditorInputToolbar;
