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

import { fromJS } from 'immutable';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import EnvironmentConfigurationTopic from '../../../js/components/environment_configuration/EnvironmentConfigurationTopic';
import MockPlan from '../../mocks/MockPlan';

const topic = MockPlan.capabilities.topics[0];

describe('EnvironmentConfigurationTopic component', () => {
  let EnvConfTopicVdom;
  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(
      <EnvironmentConfigurationTopic
        key={0}
        title={topic.title}
        description={topic.description}
        environmentGroups={fromJS(topic.environment_groups)}
      />
    );
    EnvConfTopicVdom = shallowRenderer.getRenderOutput();
  });

  it('should render list of EnvironmentGroups in fieldset', () => {
    expect(EnvConfTopicVdom.type).toEqual('fieldset');
    expect(EnvConfTopicVdom.props.className).toContain('environment-topic');
    expect(EnvConfTopicVdom.props.children.length).toEqual(2);
  });
});
