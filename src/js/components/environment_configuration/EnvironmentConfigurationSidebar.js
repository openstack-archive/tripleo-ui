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

import { camelCase } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Tab from '../ui/Tab';

const EnvironmentConfigurationSidebar = ({
  activateTab,
  categories,
  isTabActive
}) => (
  <div className="col-xs-12 col-sm-4 sidebar-pf sidebar-pf-left flex-column">
    <ul
      id="DeploymentConfiguration__CategoriesList"
      className="nav nav-pills nav-stacked nav-arrows"
    >
      {categories.map(({ title }, index) => {
        const tabName = camelCase(title);
        return (
          <Tab key={index} isActive={isTabActive(tabName)}>
            <a className="link" onClick={() => activateTab(tabName)}>
              {title}
            </a>
          </Tab>
        );
      })}
    </ul>
  </div>
);
EnvironmentConfigurationSidebar.propTypes = {
  activateTab: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  isTabActive: PropTypes.func.isRequired
};
export default EnvironmentConfigurationSidebar;
