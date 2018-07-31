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
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { Set } from 'immutable';

import FileList from './FileList';

const PlanFilesTab = ({ active, ...rest }) => (
  <div className={ClassNames({ 'tab-pane': true, active: active })}>
    <FileList {...rest} />
  </div>
);
PlanFilesTab.propTypes = {
  active: PropTypes.bool.isRequired,
  planFiles: ImmutablePropTypes.set.isRequired,
  selectedFiles: PropTypes.array.isRequired
};
PlanFilesTab.defaultProps = {
  active: false,
  planFiles: Set()
};

export default PlanFilesTab;
