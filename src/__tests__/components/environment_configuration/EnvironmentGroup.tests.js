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
import ReactShallowRenderer from 'react-test-renderer/shallow';

import EnvironmentGroup from '../../../js/components/environment_configuration/EnvironmentGroup';
import MockPlan from '../../mocks/MockPlan';

const envGroup = MockPlan.capabilities.topics[0].environment_groups[0];
const envGroupMultipleEnvs =
  MockPlan.capabilities.topics[0].environment_groups[1];

xdescribe('EnvironmentGroup component', () => {
  let EnvGroupVdom, EnvGroupInstance;
  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(
      <EnvironmentGroup
        key={0}
        title={envGroup.title}
        description={envGroup.description}
        environments={envGroup.environments}
      />
    );
    EnvGroupVdom = shallowRenderer.getRenderOutput();
    EnvGroupInstance = shallowRenderer._instance._instance;
  });

  it('should render EnvironmentGroupHeading', () => {
    expect(EnvGroupVdom.props.children[0].type.name).toEqual(
      'EnvironmentGroupHeading'
    );
    expect(EnvGroupVdom.props.children[0].props.title).toBeDefined();
    expect(EnvGroupVdom.props.children[0].props.description).toBeDefined();
  });

  it('should be able to generate inputs based on environments length', () => {
    let environmentCheckboxes = EnvGroupInstance._generateInputs();
    expect(environmentCheckboxes.props.title).toEqual('Default Configuration');
  });
});

xdescribe('EnvironmentGroup component with multiple environments', () => {
  let EnvGroupVdom, EnvGroupInstance;
  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(
      <EnvironmentGroup
        key={1}
        title={envGroupMultipleEnvs.title}
        description={envGroupMultipleEnvs.description}
        environments={envGroupMultipleEnvs.environments}
      />
    );
    EnvGroupVdom = shallowRenderer.getRenderOutput();
    EnvGroupInstance = shallowRenderer._instance._instance;
  });

  it('should render EnvironmentGroupHeading', () => {
    expect(EnvGroupVdom.props.children[0].type.name).toEqual(
      'EnvironmentGroupHeading'
    );
    expect(EnvGroupVdom.props.children[0].props.title).toBeDefined();
    expect(EnvGroupVdom.props.children[0].props.description).toBeDefined();
  });

  it('should be able to generate inputs based on environments length', () => {
    let environmentCheckboxes = EnvGroupInstance._generateInputs();
    expect(environmentCheckboxes.length).toEqual(2);
    expect(environmentCheckboxes[0].props.title).toEqual(
      'BigSwitch extensions'
    );
    expect(environmentCheckboxes[1].props.title).toEqual('Cisco N1KV backend');
  });

  it('should toggle GroupedCheckBoxes', () => {
    spyOn(EnvGroupInstance, 'setState');
    EnvGroupInstance.onGroupedCheckBoxChange(
      true,
      'environments/neutron-ml2-bigswitch.yaml'
    );
    expect(EnvGroupInstance.setState).toHaveBeenCalled();
  });
});
