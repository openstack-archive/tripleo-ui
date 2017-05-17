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

import PropTypes from 'prop-types';
import React from 'react';
import { includes } from 'lodash';
import ClassNames from 'classnames';

export const ValidationStatusIcon = ({ status, triggerValidationAction }) => {
  const statusIconClass = ClassNames({
    'list-view-pf-icon-md': true,
    'running fa fa-stop-circle': status === 'running',
    'pficon pficon-error-circle-o front': status === 'failed',
    'pficon pficon-ok front': status === 'success',
    'fa fa-play-circle': includes(['new', 'paused'], status),
    'pficon pficon-help': status === 'error'
  });

  const runValidationIconClass = 'list-view-pf-icon-md fa fa-play-circle back';

  switch (true) {
    case includes(['new', 'running', 'paused'], status):
      return (
        <a className="link" onClick={triggerValidationAction}>
          <span className={statusIconClass} />
        </a>
      );
    case includes(['success', 'failed'], status):
      return (
        <a className="link flip-container" onClick={triggerValidationAction}>
          <div className="flipper">
            <span className={statusIconClass} />
            <span className={runValidationIconClass} />
          </div>
        </a>
      );
    default:
      return (
        <a className="link flip-container" onClick={triggerValidationAction}>
          <div className="flipper">
            <span className={statusIconClass} />
            <span className={runValidationIconClass} />
          </div>
        </a>
      );
  }
};
ValidationStatusIcon.propTypes = {
  status: PropTypes.string,
  triggerValidationAction: PropTypes.func.isRequired
};
