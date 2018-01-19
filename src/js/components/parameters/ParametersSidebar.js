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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import Tab from '../ui/Tab';

const messages = defineMessages({
  general: {
    id: 'Parameters.general',
    defaultMessage: 'General'
  }
});

const ParametersSidebar = ({
  activateTab,
  enabledEnvironments,
  intl: { formatMessage },
  isTabActive
}) => (
  <div className="col-sm-4 sidebar-pf sidebar-pf-left">
    <ul
      id="Parameters__EnvironmentTabsList"
      className="nav nav-pills nav-stacked nav-arrows"
    >
      <Tab
        key="general"
        title={formatMessage(messages.general)}
        isActive={isTabActive('general')}
      >
        <a className="link" onClick={() => activateTab('general')}>
          <FormattedMessage {...messages.general} />
        </a>
      </Tab>
      <li className="spacer" />
      {enabledEnvironments.map(environment => {
        return (
          <Tab key={environment.file} isActive={isTabActive(environment.file)}>
            <a
              className="link"
              onClick={() => activateTab(environment.file)}
              title={environment.file}
            >
              {environment.title}
            </a>
          </Tab>
        );
      })}
    </ul>
  </div>
);
ParametersSidebar.propTypes = {
  activateTab: PropTypes.func.isRequired,
  enabledEnvironments: ImmutablePropTypes.list.isRequired,
  intl: PropTypes.object.isRequired,
  isTabActive: PropTypes.func.isRequired
};
export default injectIntl(ParametersSidebar);
