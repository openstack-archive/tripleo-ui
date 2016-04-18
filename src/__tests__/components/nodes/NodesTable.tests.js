import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { List, Map } from 'immutable';

import NodesTable from '../../../js/components/nodes/NodesTable';
import { NodesTableRoleCell } from '../../../js/components/nodes/NodesTable';
import { Role } from '../../../js/immutableRecords/roles';

const initialState = {
  filterString: '',
  sortBy: '',
  sortDir: 'asc'
};

const filterString = '1';

let nodes = List([
  { uuid: '1',
    properties: {
      capabilities: 'boot_option:local,profile:compute'
    }
  },
  { uuid: '2',
    properties: {
      capabilities: 'boot_option:local'
    }
  },
  { uuid: '3',
    properties: {
      capabilities: 'boot_option:local,profile:nonexistentRole'
    }
  }
]);

let roles = Map({
  control: new Role({
    name: 'control',
    title: 'Controller'
  }),
  compute: new Role({
    name: 'compute',
    title: 'Conpute'
  })
});

describe('NodesTable component', () => {
  let nodesTableVdom, nodesTableInstance;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<NodesTable nodes={nodes} roles={roles} isFetchingNodes={false}/>);
    nodesTableVdom = shallowRenderer.getRenderOutput();
    nodesTableInstance = shallowRenderer._instance._instance;
  });

  it('should render with initial state', () => {
    expect(nodesTableInstance.state).toEqual(initialState);
  });

  it('should render DataTable and pass data', () => {
    expect(nodesTableVdom.type.name).toEqual('DataTable');
    expect(nodesTableVdom.props.data).toEqual(nodes.toJS());
    expect(nodesTableVdom.props.noRowsRenderer.name).toBeDefined();
    expect(nodesTableVdom.props.children.length).toEqual(9);
  });

  it('should be able to filter rows', () => {
    spyOn(nodesTableInstance, '_filterData').and.callThrough();
    nodesTableInstance.onFilter(filterString);
    expect(nodesTableInstance.state).toEqual({ filterString: '1', sortBy: '', sortDir: 'asc' });
    expect(nodesTableInstance._filterData)
      .toHaveBeenCalledWith('1', nodesTableInstance.props.nodes.toJS());
  });
});

describe('NodesTableRoleCell', () => {
  let roleCellInstance;
  describe('getAssignedRoleTitle', () => {
    it('should return Not Assigned when profile is not set in node.properties.capabilities', () => {
      let shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<NodesTableRoleCell data={nodes.toJS()} roles={roles} rowIndex={0}/>);
      roleCellInstance = shallowRenderer._instance._instance;
      expect(roleCellInstance.getAssignedRoleTitle()).toEqual('Not assigned');
    });

    it('should return Not Assigned when profile is not set in node.properties.capabilities', () => {
      let shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<NodesTableRoleCell data={nodes.toJS()} roles={roles} rowIndex={1}/>);
      roleCellInstance = shallowRenderer._instance._instance;
      expect(roleCellInstance.getAssignedRoleTitle()).toEqual('Not assigned');
    });
  });
});
