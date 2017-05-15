import { FormattedMessage, IntlProvider } from 'react-intl';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import DataTable from '../../../../js/components/ui/tables/DataTable';
import {
  DataTableHeaderCell,
  DataTableDataFieldCell
} from '../../../../js/components/ui/tables/DataTableCells';
import DataTableColumn
  from '../../../../js/components/ui/tables/DataTableColumn';

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

describe('DataTable component', () => {
  let DataTableVdom, DataTableInstance;
  beforeEach(() => {
    let shallowRenderer = new ReactShallowRenderer();
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    shallowRenderer.render(
      <DataTable.WrappedComponent
        data={data}
        rowsCount={data.length}
        onFilter={mockOnFilter}
        noRowsRenderer={mockNoRowsRenderer}
        intl={intl}
      >
        <DataTableColumn
          key="uuid"
          header={<DataTableHeaderCell key="uuid">UUID</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={data} field="uuid" />}
        />
        <DataTableColumn
          key="provision_state"
          header={
            <DataTableHeaderCell key="provision_state">
              Provision State
            </DataTableHeaderCell>
          }
          cell={<DataTableDataFieldCell data={data} field="provision_state" />}
        />
      </DataTable.WrappedComponent>
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
        <FormattedMessage
          defaultMessage="Showing {showing} of {total} items"
          id="DataTable.itemsVisibleInTable"
          tagName="span"
          values={{ showing: <b>{2}</b>, total: <b>{2}</b> }}
        />
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
