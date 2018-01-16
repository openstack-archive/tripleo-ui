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

export const ActiveFiltersList = ({
  children,
  clearAllLabel,
  handleClearAll,
  label
}) => {
  if (children.length > 0) {
    return (
      <span className="toolbar-pf-active-filters">
        <p>{label}&nbsp;</p>
        <ul className="list-inline">{children}</ul>
        <p>
          <a className="link" onClick={() => handleClearAll()}>
            {clearAllLabel}
          </a>
        </p>
      </span>
    );
  } else {
    return null;
  }
};
ActiveFiltersList.propTypes = {
  children: PropTypes.node,
  clearAllLabel: PropTypes.string.isRequired,
  handleClearAll: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};
ActiveFiltersList.defaultProps = {
  clearAllLabel: 'Clear All Filters',
  label: 'Active Filters:'
};

export const ActiveFilter = ({ filterBy, filterString, onRemove }) => (
  <li>
    <span className="label label-info">
      {filterBy ? `${filterBy}: ${filterString}` : filterString}
      <a className="link" onClick={onRemove}>
        <span className="pficon pficon-close" />
      </a>
    </span>
  </li>
);
ActiveFilter.propTypes = {
  filterBy: PropTypes.string,
  filterString: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired
};
