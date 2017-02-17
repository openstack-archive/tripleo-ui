import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import invariant from 'invariant';

import DataTableRow from './DataTableRow';
import Loader from '../Loader';

const messages = defineMessages({
  filter: {
    id: 'DataTable.filter',
    defaultMessage: 'Filter'
  },
  itemsVisibleInTable: {
    id: 'DataTable.itemsVisibleInTable',
    defaultMessage: 'Showing {showing} of {total} items'
  }
});

class DataTable extends React.Component {
  _getColumns() {
    let columns = [];
    React.Children.forEach(this.props.children, (child) => {
      if (child == null) {
        return;
      }
      invariant(
        child.type.name === 'DataTableColumn',
        'DataTable child type should be <DataTableColumn />'
      );
      columns.push(child);
    });
    return columns;
  }

  onFilterTable(event) {
    this.props.onFilter(event.target.value);
  }

  renderFilterInput() {
    if (this.props.onFilter) {
      return (
        <div className="dataTables_filter">
          <label>
            <input type="search"
                   className=""
                   placeholder={this.props.intl.formatMessage(messages.filter)}
                   title={this.props.intl.formatMessage(messages.filter)}
                   value={this.props.filterString}
                   onChange={this.onFilterTable.bind(this)}/>
          </label>
        </div>
      );
    }
    return false;
  }

  renderTableActions() {
    if(this.props.tableActions) {
      return this.props.tableActions();
    }
  }

  render() {
    let columns = this._getColumns();

    let headers = columns.map((column) => {
      return column.props.header;
    });

    let rows = [];
    for (var i = 0; i < this.props.rowsCount; ++i) {
      rows[i] = (
        <DataTableRow key={i} index={i} columns={columns}/>
      );
    }

    return (
      <div className="dataTables_wrapper">
        <div className="dataTables_header">
          {this.renderFilterInput()}
          <div className="dataTables_actions">
            <Loader loaded={!this.props.dataOperationInProgress}
                    size="sm"
                    inline/>
            {this.renderTableActions()}
          </div>
          <div className="dataTables_info">
            <FormattedMessage {...messages.itemsVisibleInTable}
              values={{showing: <b>{rows.length}</b>,
                       total:   <b>{this.props.data.length}</b>}} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-stripped table-bordered datatable"
                 id={this.props.id}
                 role="grid">
            <thead>
              <tr>
                {headers}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? rows : this.props.noRowsRenderer()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default injectIntl(DataTable);

DataTable.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  data: React.PropTypes.array.isRequired,
  dataOperationInProgress: React.PropTypes.bool.isRequired,
  filterString: React.PropTypes.string,
  id: React.PropTypes.string,
  intl: React.PropTypes.object,
  noRowsRenderer: React.PropTypes.func.isRequired,
  onFilter: React.PropTypes.func,
  rowsCount: React.PropTypes.number.isRequired,
  tableActions: React.PropTypes.func
};
DataTable.defaultProps = {
  className: 'table',
  dataOperationInProgress: false
};
