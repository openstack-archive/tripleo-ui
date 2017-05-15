import { fromJS } from 'immutable';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import EnvironmentConfigurationTopic
  from '../../../js/components/environment_configuration/EnvironmentConfigurationTopic';
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
    expect(EnvConfTopicVdom.props.children.size).toEqual(2);
  });
});
