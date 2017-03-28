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
