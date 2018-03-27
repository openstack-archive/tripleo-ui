/**
 * Copyright 2018 Red Hat Inc.
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

import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const messages = defineMessages({
  logout: {
    id: 'UserDropdown.logout',
    defaultMessage: 'Log Out'
  }
});

class UserDropdown extends React.Component {
  render() {
    return (
      <li>
        <Dropdown>
          <DropdownToggle>
            <span className="pficon pficon-user" /> {this.props.name}
            <b className="caret" />
          </DropdownToggle>
          <DropdownItem onClick={this.props.logout}>
            <FormattedMessage {...messages.logout} />
          </DropdownItem>
        </Dropdown>
      </li>
    );
  }
}

UserDropdown.propTypes = {
  logout: PropTypes.func.isRequired,
  name: ImmutablePropTypes.map
};

export default injectIntl(UserDropdown);
