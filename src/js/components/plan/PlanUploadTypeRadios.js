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

const messages = defineMessages({
  localFolder: {
    id: 'PlanUploadTypeRadios.localFolder',
    defaultMessage: 'Local Folder'
  },
  tarArchive: {
    id: 'PlanUploadTypeRadios.tarArchive',
    defaultMessage: 'Tar Archive (.tar.gz or .tgz)'
  }
});

export default class PlanUploadTypeRadios extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>

        <div className={this.props.inputColumnClasses}>
          <label className="radio-inline" htmlFor="checkbox-tarball">
            <input
              type="radio"
              id="checkbox-tarball"
              name="uploadType"
              value="tarball"
              onChange={this.props.setUploadType}
              defaultChecked
            />
            {' '}
            <FormattedMessage {...messages.tarArchive} />
          </label>
          <label className="radio-inline" htmlFor="checkbox-folder">
            <input
              ref="checkbox-folder"
              type="radio"
              id="checkbox-folder"
              name="uploadType"
              onChange={this.props.setUploadType}
              value="folder"
            />
            {' '}
            <FormattedMessage {...messages.localFolder} />
          </label>
        </div>
      </div>
    );
  }
}

PlanUploadTypeRadios.propTypes = {
  inputColumnClasses: PropTypes.string.isRequired,
  labelColumnClasses: PropTypes.string.isRequired,
  setUploadType: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uploadType: PropTypes.string.isRequired
};
