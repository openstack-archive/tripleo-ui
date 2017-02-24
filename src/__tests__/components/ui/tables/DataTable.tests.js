// import React from 'react';
// import TestUtils from 'react-addons-test-utils';
//
// const DataTable = require('../../../js/components/ui/tables/DataTable.js');
//
// describe('DataTable component', () => {
//   it('should ')
// });

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import DataTable from '../../../../js/components/ui/tables/DataTable';
import { DataTableHeaderCell,
         DataTableDataFieldCell } from '../../../../js/components/ui/tables/DataTableCells';
import DataTableColumn from '../../../../js/components/ui/tables/DataTableColumn';

const data = [
  { uuid: 1, provision_state: 'failed' },
  { uuid: 2, provision_state: 'success' }
];

const mockNoRowsRenderer = function() {
  return 'There are no items in data';
};

const mockOnFilter = () => {
  return 'Filtering Happened';
};

// TODO(hpokorny): Re-enable this test once we get rid of PhantomJS
xdescribe('DataTable component', () => {
  let DataTableVdom, DataTableInstance;
  beforeEach(() => {
    let shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <DataTable data={data}
                 rowsCount={data.length}
                 onFilter={mockOnFilter}
                 noRowsRenderer={mockNoRowsRenderer}>
        <DataTableColumn key="uuid"
                         header={<DataTableHeaderCell key="uuid">UUID</DataTableHeaderCell>}
                         cell={<DataTableDataFieldCell data={data} field="uuid"/>}/>
        <DataTableColumn key="provision_state"
                         header={<DataTableHeaderCell key="provision_state">
                                   Provision State
                                 </DataTableHeaderCell>}
                         cell={<DataTableDataFieldCell data={data} field="provision_state"/>}/>
      </DataTable>
    );
    DataTableVdom = shallowRenderer.getRenderOutput();
    DataTableInstance = shallowRenderer._instance._instance;
  });

  it('should render correctly', () => {
    expect(DataTableVdom.props.className).toBe('dataTables_wrapper');
    let tableHeader = DataTableVdom.props.children[0];
    expect(tableHeader.props.className).toBe('dataTables_header');
    let tableFilterInput = tableHeader.props.children[0];
    expect(tableFilterInput.props.className).toBe('dataTables_filter');
    let tableInfo = tableHeader.props.children[2];
    expect(tableInfo.props.className).toBe('dataTables_info');
    expect(tableInfo).toEqual(
      <div className="dataTables_info">
        Showing <b>{data.length}</b> of <b>{data.length}</b> items
      </div>
    );

    let table = DataTableVdom.props.children[1];
    expect(table.props.className).toBe('table-responsive');
  });

  it('should be able to collect columns', () => {
    let columns = DataTableInstance._getColumns();
    expect(columns.length).toEqual(2);
  });
});
