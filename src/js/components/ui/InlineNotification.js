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
import React, { PropTypes } from 'react';

const InlineNotification = ({ children, title, type }) => {
  const notificationClasses = ClassNames({
    'alert': true,
    'alert-danger': type === 'error',
    'alert-warning': type === 'warning',
    'alert-success': type === 'success',
    'alert-info': type === 'info'
  });
  const iconClasses = ClassNames({
    'pficon': true,
    'pficon-error-circle-o': type === 'error',
    'pficon-warning-triangle-o': type === 'warning',
    'pficon-ok': type === 'success',
    'pficon-info': type === 'info'
  });

  return (
    <div className={notificationClasses}>
      <span className={iconClasses}></span>
      <strong>{title}</strong> {children}
    </div>
  );
};

InlineNotification.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  type: PropTypes.oneOf(['error', 'warning', 'success', 'info']).isRequired
};
InlineNotification.defaultProps = {
  type: 'error'
};

export default InlineNotification;
