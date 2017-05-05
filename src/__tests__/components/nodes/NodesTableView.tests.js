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

import { IntlProvider } from 'react-intl';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { List, Map, Set } from 'immutable';

import NodesTableView from '../../../js/components/nodes/NodesTableView';
import store from '../../../js/store';

let nodes = Map({
  1: { uuid: 1 },
  2: { uuid: 2 }
});

let roles = Map();

describe('RegisteredNodesTabPane component', () => {
  let vdom;
  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer();
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    shallowRenderer.render(
      <NodesTableView.WrappedComponent.WrappedComponent
        availableProfiles={List()}
        deleteNodes={jest.fn()}
        introspectNodes={jest.fn()}
        provideNodes={jest.fn()}
        tagNodes={jest.fn()}
        nodes={nodes}
        roles={roles}
        isFetchingNodes={false}
        nodesInProgress={Set()}
        nodesOperationInProgress={false}
        store={store}
        intl={intl}
      />
    );
    vdom = shallowRenderer.getRenderOutput();
    /* TODO(jtomasek): replace this with shallowRenderer.getMountedInstance() when it is available
       https://github.com/facebook/react/pull/4918/files */
    // tabPaneInstance = shallowRenderer._instance._instance;
  });

  it('should render NodesTable and pass nodes as data prop', () => {
    expect(vdom.props.children.props.children[1].type.displayName).toEqual(
      'InjectIntl(NodesTable)'
    );
    expect(vdom.props.children.props.children[1].props.nodes).toEqual(nodes);
  });
});
