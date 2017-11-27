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

import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

const IGNORED_FILE_PATHS = /(^\.git.*|^releasenotes\/.*)$/;

class PlanFileInput extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0,
      unreadableFile: null
    };
  }

  componentDidUpdate() {
    if (this.props.uploadType === 'folder') {
      // Attributes not in react's whitelist need to be added after mounting.
      this.refs[this.props.name].setAttribute(
        'webkitdirectory',
        'webkitdirectory'
      );
      this.refs[this.props.name].setAttribute('multiple', 'multiple');
    } else {
      this.refs[this.props.name].removeAttribute('webkitdirectory');
      this.refs[this.props.name].removeAttribute('multiple');
    }
  }

  processFolderFiles(inputFiles) {
    let files = [];
    let processedFilesCount = 0;

    for (let i = 0, l = inputFiles.length; i < l; i++) {
      let reader = new FileReader();
      let file = inputFiles[i];

      reader.onerror = (f => {
        return e => {
          this.setState({
            unreadableFile: f.webkitRelativePath
          });
        };
      })(file);

      reader.onload = (f => {
        return e => {
          const filePath = f.webkitRelativePath.replace(/^[^\/]*\//, '');
          if (!filePath.match(IGNORED_FILE_PATHS)) {
            let obj = {
              name: filePath,
              content: e.target.result
            };
            files.push(obj);
          }
          processedFilesCount += 1;
          this.setState(
            { progress: Math.round(100 / l * processedFilesCount) },
            () => {
              // if the last file is processed, setValue -> triggers onChange on Formsy.Form
              if (processedFilesCount === l) {
                this.props.setValue(files);
                this.setState({ progress: 0 });
              }
            }
          );
        };
      })(file);
      reader.readAsText(file);
    }
  }

  processTarball(file) {
    this.props.setValue([{ name: file.name, file: file }]);
  }

  processFiles(event) {
    if (this.props.uploadType === 'folder') {
      this.processFolderFiles.bind(this)(event.target.files);
    } else {
      this.processTarball.bind(this)(event.target.files[0]);
    }
  }

  renderErrorMessage() {
    let errorMessage = this.props.getErrorMessage();
    if (!errorMessage && this.state.unreadableFile) {
      errorMessage = `${this.state.unreadableFile} could not be read.`;
    }
    return errorMessage
      ? <span className="help-block">{errorMessage}</span>
      : false;
  }

  renderDescription() {
    let description = this.props.description;
    return description
      ? <small className="help-block">{description}</small>
      : false;
  }

  renderProgress() {
    return this.state.progress > 0
      ? <div className="progress active help-block">
          <div
            className="progress-bar"
            style={{ width: `${this.state.progress}%` }}
          />
        </div>
      : false;
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      'has-success': this.props.isValid(),
      required: this.props.isRequired()
    });

    return (
      <div className={divClasses}>
        <label
          htmlFor={this.props.name}
          className={`${this.props.labelColumnClasses} control-label`}
        >
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <input
            type="file"
            name={this.props.name}
            ref={this.props.name}
            id={this.props.name}
            onChange={this.processFiles.bind(this)}
          />
          {this.renderProgress()}
          {this.renderErrorMessage()}
          {this.renderDescription()}
        </div>
      </div>
    );
  }
}
PlanFileInput.propTypes = {
  description: PropTypes.string,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  inputColumnClasses: PropTypes.string.isRequired,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  labelColumnClasses: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  title: PropTypes.string.isRequired,
  uploadType: PropTypes.string
};
PlanFileInput.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2',
  uploadType: 'tarball'
};

export default Formsy.HOC(PlanFileInput);
