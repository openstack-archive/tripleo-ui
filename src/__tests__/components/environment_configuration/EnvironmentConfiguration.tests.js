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

import { Map } from 'immutable';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import EnvironmentConfiguration
  from '../../../js/components/environment_configuration/EnvironmentConfiguration';

describe('EnvironmentConfiguration component', () => {
  let EnvConfVdom;
  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(
      <EnvironmentConfiguration
        currentPlanName={'some-plan'}
        environmentConfiguration={Map({ topics: [] })}
      />
    );
    EnvConfVdom = shallowRenderer.getRenderOutput();
  });

  xit('should render a modal with form', () => {
    let modal = EnvConfVdom.props.children[0];
    expect(modal.props.className).toEqual('modal modal-visible');
    expect(modal.props.children.props.className).toEqual(
      'modal-dialog modal-lg'
    );
    expect(modal.props.children.props.children.props.className).toEqual(
      'modal-content'
    );
    let form = modal.props.children.props.children.props.children;
    expect(form.ref).toEqual('environmentConfigurationForm');
  });
});
