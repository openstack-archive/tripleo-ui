import { IntlProvider } from 'react-intl';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Map, Set } from 'immutable';

import MaintenanceNodesTabPane from '../../../js/components/nodes/MaintenanceNodesTabPane';
import store from '../../../js/store';

let maintenanceNodes = Map({
  1: { uuid: 1 },
  2: { uuid: 2 }
});

let roles = Map();

describe('MaintenanceNodesTabPane component', () => {
  let tabPaneVdom;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    shallowRenderer.render(
      <MaintenanceNodesTabPane.WrappedComponent
        maintenanceNodes={maintenanceNodes}
        roles={roles}
        isFetchingNodes={false}
        nodesInProgress={Set()}
        nodesOperationInProgress={false}
        store={store}
        intl={intl}/>
    );
    tabPaneVdom = shallowRenderer.getRenderOutput();
  });

  it('should render NodesTable and pass nodes as data prop', () => {
    expect(tabPaneVdom.props.children[1].type.displayName).toEqual('InjectIntl(NodesTable)');
    expect(tabPaneVdom.props.children[1].props.nodes).toEqual(maintenanceNodes);
  });
});
