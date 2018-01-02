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

import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import EnvironmentGroup from './EnvironmentGroup';

const EnvironmentConfigurationTopic = ({ description, environmentGroups }) => (
  <fieldset className="environment-topic">
    {description && (
      <p>
        <i>{description}</i>
      </p>
    )}
    {environmentGroups
      .toList()
      .map((envGroup, index) => (
        <EnvironmentGroup
          key={index}
          title={envGroup.get('title')}
          description={envGroup.get('description')}
          environments={envGroup.get('environments')}
          mutuallyExclusive={envGroup.get('mutually_exclusive')}
        />
      ))}
  </fieldset>
);
EnvironmentConfigurationTopic.propTypes = {
  description: PropTypes.string,
  environmentGroups: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired
};

export default EnvironmentConfigurationTopic;
