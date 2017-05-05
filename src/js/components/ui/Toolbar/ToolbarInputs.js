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

import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

export const SortDirectionInput = ({ input: { onChange, value }, title }) => {
  return (
    <Button
      title={title}
      type="button"
      bsStyle="link"
      onClick={() => onChange(value === 'asc' ? 'desc' : 'asc')}
    >
      <span className={`fa fa-sort-alpha-${value}`} />
    </Button>
  );
};
SortDirectionInput.propTypes = {
  children: PropTypes.node,
  input: PropTypes.object.isRequired,
  title: PropTypes.string
};

const getIconClass = optionKey => {
  switch (optionKey) {
    case 'cards':
      return 'fa fa-th-large';
    case 'list':
      return 'fa fa-th-list';
    default:
      return 'fa fa-th';
  }
};

export const ContentViewSelectorInput = ({
  input: { onChange, value },
  options
}) => {
  return (
    <div>
      {Object.keys(options).map(k => (
        <Button
          key={k}
          type="button"
          bsStyle="link"
          title={options[k]}
          onClick={() => onChange(k)}
        >
          <i className={getIconClass(k)} />
        </Button>
      ))}
    </div>
  );
};
ContentViewSelectorInput.propTypes = {
  input: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired
};
