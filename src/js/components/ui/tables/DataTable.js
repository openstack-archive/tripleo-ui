/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import PropTypes from 'prop-types';
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
    React.Children.forEach(this.props.children, child => {
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
            <input
              type="search"
              className=""
              placeholder={this.props.intl.formatMessage(messages.filter)}
              title={this.props.intl.formatMessage(messages.filter)}
              value={this.props.filterString}
              onChange={this.onFilterTable.bind(this)}
            />
          </label>
        </div>
      );
    }
    return false;
  }

  renderTableActions() {
    if (this.props.tableActions) {
      return this.props.tableActions();
    }
  }

  render() {
    let columns = this._getColumns();

    let headers = columns.map(column => {
      return column.props.header;
    });

    let rows = [];
    for (var i = 0; i < this.props.rowsCount; ++i) {
      rows[i] = <DataTableRow key={i} index={i} columns={columns} />;
    }

    return (
      <div className="dataTables_wrapper">
        <div className="dataTables_header">
          {this.renderFilterInput()}
          <div className="dataTables_actions">
            <Loader
              loaded={!this.props.dataOperationInProgress}
              size="sm"
              inline
            />
            {this.renderTableActions()}
          </div>
          <div className="dataTables_info">
            <FormattedMessage
              {...messages.itemsVisibleInTable}
              values={{
                showing: <b>{rows.length}</b>,
                total: <b>{this.props.data.length}</b>
              }}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table
            className="table table-stripped table-bordered datatable"
            id={this.props.id}
            role="grid"
          >
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  data: PropTypes.array.isRequired,
  dataOperationInProgress: PropTypes.bool.isRequired,
  filterString: PropTypes.string,
  id: PropTypes.string,
  intl: PropTypes.object,
  noRowsRenderer: PropTypes.func.isRequired,
  onFilter: PropTypes.func,
  rowsCount: PropTypes.number.isRequired,
  tableActions: PropTypes.func
};
DataTable.defaultProps = {
  className: 'table',
  dataOperationInProgress: false
};
