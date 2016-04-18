import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Map } from 'immutable';

import IntrospectedNodesTabPane from '../../../js/components/nodes/IntrospectedNodesTabPane';

let nodes = Map({
  isFetching: false,
  introspected: Map({
    1: { uuid: 1 },
    2: { uuid: 2 }
  })
});

let roles = Map();

describe('IntrospectedNodesTabPane component', () => {
  let tabPaneVdom;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<IntrospectedNodesTabPane nodes={nodes} roles={roles}/>);
    tabPaneVdom = shallowRenderer.getRenderOutput();
  });

  it('should render NodesTable and pass nodes as data prop', () => {
    expect(tabPaneVdom.props.children[1].type.name).toEqual('NodesTable');
    expect(tabPaneVdom.props.children[1].props.nodes).toEqual(nodes.get('introspected'));
  });
});
