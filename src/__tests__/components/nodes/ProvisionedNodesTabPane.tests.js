import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { List, Map } from 'immutable';

import ProvisionedNodesTabPane from '../../../js/components/nodes/ProvisionedNodesTabPane';

let nodes = Map({
  isFetching: false,
  provisioned: List([
    { uuid: 1 },
    { uuid: 2 }
  ])
});

let roles = Map();

describe('ProvisionedNodesTabPane component', () => {
  let tabPaneVdom;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<ProvisionedNodesTabPane nodes={nodes} roles={roles}/>);
    tabPaneVdom = shallowRenderer.getRenderOutput();
  });

  it('should render NodesTable and pass nodes as data prop', () => {
    expect(tabPaneVdom.type.name).toEqual('NodesTable');
    expect(tabPaneVdom.props.nodes).toEqual(nodes.get('provisioned'));
  });
});
