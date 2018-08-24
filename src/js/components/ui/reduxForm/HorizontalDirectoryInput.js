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

import cx from 'classnames';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  ProgressBar
} from 'patternfly-react';
import { throttle } from 'lodash';

import { getValidationState, InputDescription, InputMessage } from './utils';
import {
  UNREADABLE_FILE,
  IGNORED_FILE_PATHS
} from '../../../constants/PlansConstants';

const messages = defineMessages({
  readingFiles: {
    id: 'HorizontalDirectoryInput.readingFiles',
    defaultMessage: 'Reading files... {progress}%'
  },
  filesReady: {
    id: 'HorizontalDirectoryInput.filesReady',
    defaultMessage: '{filesCount} Files'
  },
  unreadableFilesValidationError: {
    id: 'HorizontalDirectoryInput.unreadableFilesValidationError',
    defaultMessage: 'Some files could not be read: {files}'
  },
  noFilesValidationError: {
    id: 'HorizontalDirectoryInput.noFilesValidationError',
    defaultMessage: 'Provide a directory of deployment plan files'
  }
});

class HorizontalDirectoryInput extends Component {
  constructor(props) {
    super();
    this.state = { progress: props.input.value.length > 0 ? 100 : 0 };
  }

  updateProgress = throttle((total, current) => {
    this.setState({ progress: Math.ceil(100 / total * current) });
  }, 100);

  processFiles = e => {
    e.preventDefault();
    const rawFiles = e.target.files;
    let processedFiles = [];
    let processedFilesCount = 0;
    this.setState({ progress: 0 });

    for (let i = 0, l = rawFiles.length; i < l; i++) {
      const file = rawFiles[i];
      let reader = new FileReader();

      reader.onerror = e => {
        const filePath = file.webkitRelativePath.replace(/^[^\/]*\//, '');
        if (!filePath.match(IGNORED_FILE_PATHS)) {
          processedFiles.push({ filePath, contents: UNREADABLE_FILE });
        }
      };

      reader.onload = e => {
        const filePath = file.webkitRelativePath.replace(/^[^\/]*\//, '');
        if (!filePath.match(IGNORED_FILE_PATHS)) {
          processedFiles.push({ filePath, contents: e.target.result });
        }
      };

      reader.onloadend = e => {
        processedFilesCount += 1;
        this.updateProgress(l, processedFilesCount);
        if (processedFilesCount === l) {
          this.setState({ progress: 100 }, () => {
            this.props.input.onChange(processedFiles);
          });
        }
      };

      reader.readAsText(file);
    }
  };

  render() {
    const {
      id,
      intl: { formatMessage },
      label,
      labelColumns,
      inputColumns,
      description,
      input,
      meta,
      required,
      ...rest
    } = this.props;
    const { progress } = this.state;
    return (
      <FormGroup controlId={id} validationState={getValidationState(meta)}>
        <Col
          componentClass={ControlLabel}
          sm={labelColumns}
          className={cx({ 'required-pf': required })}
        >
          {label}
        </Col>
        <Col sm={inputColumns}>
          <FormControl
            type="file"
            {...input}
            {...rest}
            onChange={this.processFiles.bind(this)}
            onBlur={() => input.onBlur(undefined)}
            value={undefined}
            multiple
            webkitdirectory="true"
          />
          {progress !== 0 && (
            <ProgressBar
              now={progress}
              label={
                progress === 100
                  ? formatMessage(messages.filesReady, {
                      filesCount: input.value.length
                    })
                  : formatMessage(messages.readingFiles, { progress })
              }
            />
          )}
          <InputMessage {...meta} />
          <InputDescription description={description} />
        </Col>
      </FormGroup>
    );
  }
}
HorizontalDirectoryInput.propTypes = {
  description: PropTypes.node,
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  inputColumns: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
  label: PropTypes.node,
  labelColumns: PropTypes.number.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool.isRequired
};
HorizontalDirectoryInput.defaultProps = {
  labelColumns: 5,
  inputColumns: 7,
  required: false
};

export const validateDirectoryInput = files => {
  const unreadableFiles = files.filter(f => f.contents === UNREADABLE_FILE);
  if (!files.length) {
    return <FormattedMessage {...messages.noFilesValidationError} />;
  } else if (unreadableFiles.length) {
    return (
      <FormattedMessage
        {...messages.unreadableFilesValidationError}
        values={{ files: unreadableFiles.map(f => f.filePath).join(', ') }}
      />
    );
  }
};

export default injectIntl(HorizontalDirectoryInput);
