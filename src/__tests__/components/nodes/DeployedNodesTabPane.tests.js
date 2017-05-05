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
import TestUtils from 'react-addons-test-utils';
import { Map, Set } from 'immutable';

import DeployedNodesTabPane from '../../../js/components/nodes/DeployedNodesTabPane';
import store from '../../../js/store';

let nodes = Map({
  isFetching: false,
  deployed: Map({
    1: { uuid: 1 },
    2: { uuid: 2 }
  })
});

let roles = Map();

describe('DeployedNodesTabPane component', () => {
  let tabPaneVdom;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    shallowRenderer.render(
      <DeployedNodesTabPane.WrappedComponent
        deployedNodes={nodes.get('deployed')}
        roles={roles}
        isFetchingNodes={nodes.get('isFetching')}
        nodesInProgress={Set()}
        nodesOperationInProgress={false}
        store={store}
        intl={intl}/>
    );
    tabPaneVdom = shallowRenderer.getRenderOutput();
  });

  it('should render NodesTable and pass nodes as data prop', () => {
    expect(tabPaneVdom.props.children[1].type.displayName).toEqual('InjectIntl(NodesTable)');
    expect(tabPaneVdom.props.children[1].props.nodes).toEqual(nodes.get('deployed'));
  });
});
