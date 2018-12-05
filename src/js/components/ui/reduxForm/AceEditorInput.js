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
import 'brace/theme/textmate';
import 'brace/mode/yaml';

import AceEditorInputToolbar from './AceEditorInputToolbar';

const aceOnBlur = onBlur => (_event, editor) => {
  const value = editor && editor.getValue();
  onBlur(value);
};

const AceEditorInput = ({ input, meta, description, ...rest }) => (
  <Fragment>
    <AceEditor {...input} onBlur={aceOnBlur(input.onBlur)} {...rest} />
    <AceEditorInputToolbar {...meta} description={description} />
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
  theme: 'textmate',
  mode: 'yaml',
  tabSize: 2,
  enableBasicAutocompletion: false,
  editorProps: { $blockScrolling: true }
};

export default AceEditorInput;
