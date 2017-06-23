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

import { Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

const DropdownKebab = ({ children, id, pullRight }) => {
  return (
    <Dropdown className="dropdown-kebab-pf" id={id} pullRight={pullRight}>
      <Dropdown.Toggle
        bsStyle="link"
        noCaret
        onClick={e => e.stopPropagation()}
      >
        <span className="fa fa-ellipsis-v" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
};
DropdownKebab.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  pullRight: PropTypes.bool
};
export default DropdownKebab;
