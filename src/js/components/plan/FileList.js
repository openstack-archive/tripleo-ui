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
import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

const messages = defineMessages({
  planFiles: {
    id: 'FileList.planFiles',
    defaultMessage: 'Plan Files'
  }
});

export default class FileList extends React.Component {
  render() {
    const { planFiles, selectedFiles } = this.props;
    const selectedFilesPaths = selectedFiles.map(file => file.filePath);
    const mergedFiles = planFiles.union(selectedFilesPaths).sort();
    return (
      <div className="panel panel-default">
        <div className="panel-heading" role="tab" id="plan-files-list-panel">
          <h4 className="panel-title">
            <FormattedMessage {...messages.planFiles} />
          </h4>
        </div>
        <table className="table upload-files">
          <tbody>
            {mergedFiles.toArray().map(file => {
              const classes = cx({
                'new-plan-file': selectedFilesPaths.includes(file)
              });
              return (
                <tr key={file}>
                  <td className={classes}>{file}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

FileList.propTypes = {
  planFiles: ImmutablePropTypes.set.isRequired,
  selectedFiles: PropTypes.array.isRequired
};
