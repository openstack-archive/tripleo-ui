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

import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';

import FileList from './FileList';

export default class PlanFilesTab extends React.Component {
  render() {
    return (
      <div className={`tab-pane ${this.props.active}`}>
        <FileList planFiles={this.props.planFiles}
                  selectedFiles={this.props.selectedFiles} />
      </div>
    );
  }
}
PlanFilesTab.propTypes = {
  active: PropTypes.string,
  planFiles: ImmutablePropTypes.map,
  selectedFiles: PropTypes.array
};
