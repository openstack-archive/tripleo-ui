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

import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import Dropdown from '../components/ui/dropdown/Dropdown';
import DropdownToggle from '../components/ui/dropdown/DropdownToggle';
import DropdownItem from '../components/ui/dropdown/DropdownItem';

const messages = defineMessages({
  about: {
    id: 'StatusDropdown.about',
    defaultMessage: 'About'
  },
  debug: {
    id: 'StatusDropdown.debug',
    defaultMessage: 'Debug'
  },
  status: {
    id: 'StatusDropdown.status',
    defaultMessage: 'Service Status'
  }
});

class StatusDropdown extends React.Component {
  render() {
    return (
      <Dropdown>
        <DropdownToggle>
          <span className="pficon pficon-help" /> <b className="caret" />
        </DropdownToggle>
        <DropdownItem>
          <FormattedMessage {...messages.status} />
        </DropdownItem>
        <DropdownItem to="/debug">
          <FormattedMessage {...messages.debug} />
        </DropdownItem>
        <DropdownItem>
          <FormattedMessage {...messages.about} />
        </DropdownItem>
      </Dropdown>
    );
  }
}

export default injectIntl(StatusDropdown);
