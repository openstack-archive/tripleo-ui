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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

import DataTable from '../ui/tables/DataTable'
import {
  DataTableDateFieldCell,
  DataTableDataFieldCell,
  DataTableHeaderCell
} from '../ui/tables/DataTableCells'
import DataTableColumn from '../ui/tables/DataTableColumn'
import Loader from '../ui/Loader'

const messages = defineMessages({
  loadingResources: {
    id: 'StackResourcesTable.loadingResources',
    defaultMessage: 'Loading Resources...'
  },
  noResourcesAvailable: {
    id: 'StackResourcesTable.noResourcesAvailable',
    defaultMessage: 'There are no Resources available.'
  },
  name: {
    id: 'StackResourcesTable.name',
    defaultMessage: 'Name'
  },
  status: {
    id: 'StackResourcesTable.status',
    defaultMessage: 'Status'
  },
  updatedTime: {
    id: 'StackResourcesTable.updatedTime',
    defaultMessage: 'Updated Time'
  }
})

class StackResourcesTable extends React.Component {
  constructor() {
    super()
    this.state = {
      filterString: ''
    }
  }

  renderNoResourcesFound() {
    return (
      <tr>
        <td className="no-results" colSpan="10">
          <Loader
            loaded={!this.props.isFetchingResources}
            height={40}
            content={this.props.intl.formatMessage(messages.loadingResources)}
          >
            <p className="text-center">
              <FormattedMessage {...messages.noResourcesAvailable} />
            </p>
          </Loader>
        </td>
      </tr>
    )
  }

  onFilter(filterString) {
    this.setState({
      filterString: filterString
    })
  }

  _filterData(filterString, data) {
    let dataKeys = ['resource_name', 'resource_status']
    return filterString
      ? data.filter(row => {
          let result = dataKeys.filter(dataKey => {
            return row[dataKey]
              .toLowerCase()
              .includes(filterString.toLowerCase())
          })
          return result.length > 0
        })
      : data
  }

  render() {
    let filteredData = this._filterData(
      this.state.filterString,
      this.props.resources.toList().toJS()
    )
    return (
      <DataTable
        {...this.props}
        data={this.props.resources.toList().toJS()}
        rowsCount={filteredData.length}
        noRowsRenderer={this.renderNoResourcesFound.bind(this)}
        onFilter={this.onFilter.bind(this)}
        filterString={this.state.filterString}
      >
        <DataTableColumn
          key="resource_name"
          header={
            <DataTableHeaderCell key="resource_name">
              <FormattedMessage {...messages.name} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell data={filteredData} field="resource_name" />
          }
        />
        <DataTableColumn
          key="resource_status"
          header={
            <DataTableHeaderCell key="resource_status">
              <FormattedMessage {...messages.status} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell
              data={filteredData}
              field="resource_status"
            />
          }
        />
        <DataTableColumn
          key="updated_time"
          header={
            <DataTableHeaderCell key="updated_time">
              <FormattedMessage {...messages.updatedTime} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDateFieldCell data={filteredData} field="updated_time" />
          }
        />
      </DataTable>
    )
  }
}
StackResourcesTable.propTypes = {
  intl: PropTypes.object,
  isFetchingResources: PropTypes.bool.isRequired,
  resources: ImmutablePropTypes.map.isRequired
}

export default injectIntl(StackResourcesTable)
