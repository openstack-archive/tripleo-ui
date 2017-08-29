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

import ClassNames from 'classnames'
import { defineMessages, FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'
import { PlanFile } from '../../immutableRecords/plans'
import PropTypes from 'prop-types'
import React from 'react'

const messages = defineMessages({
  planFiles: {
    id: 'FileList.planFiles',
    defaultMessage: 'Plan Files'
  }
})

export default class FileList extends React.Component {
  getMergedFiles(planFiles, selectedFiles) {
    let files = {}
    if (!planFiles.isEmpty()) {
      planFiles.map(file => {
        files[file.name] = file
      })
    }
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        let existing = files[file.name]
        let info = !existing
          ? Map({ newFile: !planFiles.isEmpty() })
          : Map({ newFile: false })
        files[file.name] = PlanFile({ name: file.name, info: info })
      })
    }
    return Map(files)
      .sort((fileA, fileB) => {
        let [aName, aNew] = [
          fileA.name.toLowerCase(),
          fileA.getIn(['info', 'newFile'])
        ]
        let [bName, bNew] = [
          fileB.name.toLowerCase(),
          fileB.getIn(['info', 'newFile'])
        ]
        if (aNew && !bNew) {
          return -1
        } else if (!aNew && bNew) {
          return 1
        } else {
          return aName > bName ? 1 : -1
        }
      })
      .toArray()
  }

  render() {
    if (this.props.planFiles.size === 0 && this.props.selectedFiles === 0) {
      return null
    }
    let files = this.getMergedFiles(
      this.props.planFiles,
      this.props.selectedFiles
    ).map(file => {
      let info = file.info.toJS() || {}
      let classes = ClassNames({ 'new-plan-file': info.newFile })
      return (
        <tr key={file.name}>
          <td className={classes}>{file.name}</td>
        </tr>
      )
    })
    return (
      <div className="panel panel-default">
        <div className="panel-heading" role="tab" id="plan-files-list-panel">
          <h4 className="panel-title">
            <FormattedMessage {...messages.planFiles} />
          </h4>
        </div>
        <table className="table upload-files">
          <tbody>
            {files}
          </tbody>
        </table>
      </div>
    )
  }
}

FileList.propTypes = {
  planFiles: ImmutablePropTypes.map,
  selectedFiles: PropTypes.array
}

FileList.defaultProps = {
  planFiles: Map(),
  selectedFiles: []
}
