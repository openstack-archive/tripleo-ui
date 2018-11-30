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
import AceEditor from 'react-ace';
import 'brace/theme/tomorrow_night';
import 'brace/mode/yaml';
import { Icon } from 'patternfly-react';

const aceOnBlur = onBlur => (_event, editor) => {
  const value = editor && editor.getValue();
  onBlur(value);
};

const AceEditorInput = ({
  input,
  meta: { valid, invalid, warning, error },
  description,
  ...rest
}) => (
  <Fragment>
    <AceEditor
      {...input}
      {...rest}
      onBlur={aceOnBlur(input.onBlur)}
      editorProps={{ $blockScrolling: true }}
      tabSize={4}
      enableBasicAutocompletion={false}
    />
    <div
      style={{
        background: '#1D1F21',
        borderTop: '1px solid #25282c',
        color: 'white',
        padding: '3px 5px',
        minHeight: 26
      }}
    >
      {invalid && (
        <Fragment>
          <Icon type="pf" name="error-circle-o" /> Error: {error}
        </Fragment>
      )}
      {warning && (
        <Fragment>
          <Icon type="pf" name="warning-triangle-o" /> Warning: {warning}
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
  </Fragment>
);
AceEditorInput.propTypes = {
  description: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
};
AceEditorInput.defaultProps = {
  theme: 'tomorrow_night',
  mode: 'yaml'
};

export default AceEditorInput;
