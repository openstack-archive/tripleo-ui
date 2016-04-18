import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Map } from 'immutable';

import ProvisionedNodesTabPane from '../../../js/components/nodes/ProvisionedNodesTabPane';

let nodes = Map({
  isFetching: false,
  provisioned: Map({
    1: { uuid: 1 },
    2: { uuid: 2 }
  })
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
    expect(tabPaneVdom.props.children[1].type.name).toEqual('NodesTable');
    expect(tabPaneVdom.props.children[1].props.nodes).toEqual(nodes.get('provisioned'));
  });
});
