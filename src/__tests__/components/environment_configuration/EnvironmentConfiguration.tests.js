import { Map } from 'immutable';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import EnvironmentConfiguration from
  '../../../js/components/environment_configuration/EnvironmentConfiguration';

describe('EnvironmentConfiguration component', () => {
  let EnvConfVdom;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <EnvironmentConfiguration
        currentPlanName={'some-plan'}
        environmentConfiguration={Map({ topics: [] })}/>
    );
    EnvConfVdom = shallowRenderer.getRenderOutput();
  });

  xit('should render a modal with form', () => {
    let modal = EnvConfVdom.props.children[0];
    expect(modal.props.className).toEqual('modal modal-visible');
    expect(modal.props.children.props.className).toEqual('modal-dialog modal-lg');
    expect(modal.props.children.props.children.props.className).toEqual('modal-content');
    let form = modal.props.children.props.children.props.children;
    expect(form.ref).toEqual('environmentConfigurationForm');
  });
});
