import { IntlProvider } from 'react-intl';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Map, Set } from 'immutable';

import NodesTable from '../../../js/components/nodes/NodesTable';
import { NodesTableProfileCell } from '../../../js/components/nodes/NodesTable';
import { Role } from '../../../js/immutableRecords/roles';

const initialState = {
  filterString: '',
  sortBy: '',
  sortDir: 'asc'
};

const filterString = '1';

let nodes = Map({
  1: {
    uuid: '1',
    name: 'N1',
    properties: {
      capabilities: 'boot_option:local,profile:compute'
    }
  },
  2: {
    uuid: '2',
    name: 'N2',
    properties: {
      capabilities: 'boot_option:local'
    }
  },
  3: {
    uuid: '3',
    name: 'N3',
    properties: {
      capabilities: 'boot_option:local,profile:nonexistentRole'
    }
  }
});

let roles = Map({
  control: new Role({
    name: 'control',
    title: 'Controller'
  }),
  compute: new Role({
    name: 'compute',
    title: 'Compute'
  })
});

describe('NodesTable component', () => {
  let nodesTableVdom, nodesTableInstance;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    shallowRenderer.render(
      <NodesTable.WrappedComponent
        nodes={nodes}
        roles={roles}
        nodesInProgress={Set()}
        isFetchingNodes={false}
        intl={intl}/>
    );
    nodesTableVdom = shallowRenderer.getRenderOutput();
    nodesTableInstance = shallowRenderer._instance._instance;
  });

  it('should render with initial state', () => {
    expect(nodesTableInstance.state).toEqual(initialState);
  });

  it('should render DataTable and pass data', () => {
    expect(nodesTableVdom.type.displayName).toEqual('InjectIntl(DataTable)');
    expect(nodesTableVdom.props.data).toEqual(nodes.toList().toJS());
    expect(nodesTableVdom.props.noRowsRenderer.name).toBeDefined();
    expect(nodesTableVdom.props.children.length).toEqual(10);
  });

  it('should be able to filter rows', () => {
    spyOn(nodesTableInstance, '_filterData').and.callThrough();
    nodesTableInstance.onFilter(filterString);
    expect(nodesTableInstance.state).toEqual({ filterString: '1', sortBy: '', sortDir: 'asc' });
    expect(nodesTableInstance._filterData)
      .toHaveBeenCalledWith('1', nodesTableInstance.props.nodes.toList().toJS());
  });
});

describe('NodesTableRoleCell', () => {
  let roleCellInstance;
  describe('getAssignedRoleTitle', () => {
    it('should return Not Assigned when profile is not set in node.properties.capabilities', () => {
      let shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<NodesTableProfileCell data={nodes.toList().toJS()}
                                                 roles={roles}
                                                 rowIndex={0}/>);
      roleCellInstance = shallowRenderer._instance._instance;
      expect(roleCellInstance.getAssignedRoleTitle()).toEqual('Compute');
    });

    it('should return Not Assigned when profile is not set in node.properties.capabilities', () => {
      let shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<NodesTableProfileCell data={nodes.toList().toJS()}
                                                 roles={roles}
                                                 rowIndex={1}/>);
      roleCellInstance = shallowRenderer._instance._instance;
      expect(roleCellInstance.getAssignedRoleTitle()).toEqual('-');
    });
  });
});
