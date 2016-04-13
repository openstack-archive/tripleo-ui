import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { List, Map } from 'immutable';

import MaintenanceNodesTabPane from '../../../js/components/nodes/MaintenanceNodesTabPane';

let nodes = Map({
  isFetching: false,
  maintenance: List([
    { uuid: 1 },
    { uuid: 2 }
  ])
});

let roles = Map();

describe('MaintenanceNodesTabPane component', () => {
  let tabPaneVdom;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<MaintenanceNodesTabPane nodes={nodes} roles={roles}/>);
    tabPaneVdom = shallowRenderer.getRenderOutput();
  });

  it('should render NodesTable and pass nodes as data prop', () => {
    expect(tabPaneVdom.type.name).toEqual('NodesTable');
    expect(tabPaneVdom.props.nodes).toEqual(nodes.get('maintenance'));
  });
});
