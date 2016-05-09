import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Map } from 'immutable';

import MaintenanceNodesTabPane from '../../../js/components/nodes/MaintenanceNodesTabPane';
import store from '../../../js/store';

let nodes = Map({
  isFetching: false,
  maintenance: Map({
    1: { uuid: 1 },
    2: { uuid: 2 }
  })
});

let roles = Map();

xdescribe('MaintenanceNodesTabPane component', () => {
  let tabPaneVdom;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<MaintenanceNodesTabPane nodes={nodes}
                                                    roles={roles}
                                                    store={store}/>);
    tabPaneVdom = shallowRenderer.getRenderOutput();
  });

  it('should render NodesTable and pass nodes as data prop', () => {
    expect(tabPaneVdom.props.children[1].type.name).toEqual('NodesTable');
    expect(tabPaneVdom.props.children[1].props.nodes).toEqual(nodes.get('maintenance'));
  });
});
