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

import { result } from 'lodash';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DataTable from '../ui/tables/DataTable';
import {
  DataTableCell,
  DataTableDataFieldCell,
  DataTableHeaderCell
} from '../ui/tables/DataTableCells';
import { DataTableCheckBoxCell } from '../ui/tables/DataTableCells';
import DataTableColumn from '../ui/tables/DataTableColumn';
import { Loader } from '../ui/Loader';
import { parseNodeCapabilities } from '../../utils/nodes';

const messages = defineMessages({
  noNodes: {
    id: 'NodesTable.noNodes',
    defaultMessage: 'There are no Nodes available.'
  },
  loadingNodes: {
    id: 'NodesTable.loadingNodes',
    defaultMessage: 'Loading Nodes...'
  },
  macAddresses: {
    id: 'NodesTables.macAddresses',
    defaultMessage: 'MAC Address(es)',
    description: 'Table header'
  },
  name: {
    id: 'NodesTables.name',
    defaultMessage: 'Name',
    description: 'Table header'
  },
  profile: {
    id: 'NodesTables.profile',
    defaultMessage: 'Profile',
    description: 'Table header'
  },
  cpuArch: {
    id: 'NodesTables.cpuArch',
    defaultMessage: 'CPU Arch.',
    description: 'Table header'
  },
  cpuCores: {
    id: 'NodesTables.cpuCores',
    defaultMessage: 'CPU (cores)',
    description: 'Table header'
  },
  diskGb: {
    id: 'NodesTables.diskGb',
    defaultMessage: 'Disk (GB)',
    description: 'Table header'
  },
  memoryMb: {
    id: 'NodesTables.memoryMb',
    defaultMessage: 'Memory (MB)',
    description: 'Table header'
  },
  powerState: {
    id: 'NodesTables.powerState',
    defaultMessage: 'Power State',
    description: 'Table header'
  },
  provisionState: {
    id: 'NodesTables.provisionState',
    defaultMessage: 'Provision State',
    description: 'Table header'
  },
  maintenance: {
    id: 'NodesTables.maintenance',
    defaultMessage: 'Maintenance',
    description: 'Table header'
  }
});

class NodesTable extends React.Component {
  constructor() {
    super();
    this.state = {
      filterString: '',
      sortBy: '',
      sortDir: 'asc'
    };
  }

  renderNoNodesFound() {
    return (
      <tr>
        <td className="no-results" colSpan="11">
          <Loader
            loaded={!this.props.isFetchingNodes}
            height={40}
            content={this.props.intl.formatMessage(messages.loadingNodes)}
          >
            <p className="text-center">
              <FormattedMessage {...messages.noNodes} />
            </p>
          </Loader>
        </td>
      </tr>
    );
  }

  onFilter(filterString) {
    this.setState({
      filterString: filterString
    });
  }

  _filterData(filterString, data) {
    let dataKeys = ['name'];
    return filterString
      ? data.filter(row => {
          let result = dataKeys.filter(dataKey =>
            row[dataKey].toLowerCase().includes(filterString.toLowerCase())
          );
          return result.length > 0;
        })
      : data;
  }

  render() {
    let filteredData = this._filterData(
      this.state.filterString,
      this.props.nodes.toList().toJS()
    );
    return (
      <DataTable
        {...this.props}
        data={this.props.nodes.toList().toJS()}
        rowsCount={filteredData.length}
        noRowsRenderer={this.renderNoNodesFound.bind(this)}
        onFilter={this.onFilter.bind(this)}
        filterString={this.state.filterString}
      >
        <DataTableColumn
          key="select"
          header={<DataTableHeaderCell key="select" className="shrink" />}
          cell={
            <NodesTableCheckBoxCell
              data={filteredData}
              nodesInProgress={this.props.nodesInProgress}
              field="uuid"
              className="shrink"
            />
          }
        />
        <DataTableColumn
          key="macs"
          header={
            <DataTableHeaderCell key="macs">
              <FormattedMessage {...messages.macAddresses} />
            </DataTableHeaderCell>
          }
          cell={<NodesTableMacsCell data={filteredData} field="macs" />}
        />
        <DataTableColumn
          key="name"
          header={
            <DataTableHeaderCell key="name">
              <FormattedMessage {...messages.name} />
            </DataTableHeaderCell>
          }
          cell={<DataTableDataFieldCell data={filteredData} field="name" />}
        />
        <DataTableColumn
          key="role"
          header={
            <DataTableHeaderCell key="role">
              <FormattedMessage {...messages.profile} />
            </DataTableHeaderCell>
          }
          cell={<NodesTableProfileCell data={filteredData} />}
        />
        <DataTableColumn
          key="properties.cpu_arch"
          header={
            <DataTableHeaderCell key="properties.cpu_arch">
              <FormattedMessage {...messages.cpuArch} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell
              data={filteredData}
              field="properties.cpu_arch"
            />
          }
        />
        <DataTableColumn
          key="properties.cpus"
          header={
            <DataTableHeaderCell key="properties.cpus">
              <FormattedMessage {...messages.cpuCores} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell
              data={filteredData}
              field="properties.cpus"
            />
          }
        />
        <DataTableColumn
          key="properties.local_gb"
          header={
            <DataTableHeaderCell key="properties.local_gb">
              <FormattedMessage {...messages.diskGb} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell
              data={filteredData}
              field="properties.local_gb"
            />
          }
        />
        <DataTableColumn
          key="properties.memory_mb"
          header={
            <DataTableHeaderCell key="properties.memory_mb">
              <FormattedMessage {...messages.memoryMb} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell
              data={filteredData}
              field="properties.memory_mb"
            />
          }
        />
        <DataTableColumn
          key="power_state"
          header={
            <DataTableHeaderCell key="power_state">
              <FormattedMessage {...messages.powerState} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell data={filteredData} field="power_state" />
          }
        />
        <DataTableColumn
          key="provision_state"
          header={
            <DataTableHeaderCell key="provision_state">
              <FormattedMessage {...messages.provisionState} />
            </DataTableHeaderCell>
          }
          cell={
            <DataTableDataFieldCell
              data={filteredData}
              field="provision_state"
            />
          }
        />
        <DataTableColumn
          key="maintenance"
          header={
            <DataTableHeaderCell key="maintenance">
              <FormattedMessage {...messages.maintenance} />
            </DataTableHeaderCell>
          }
          cell={
            <NodesTableMaintenanceCell
              data={filteredData}
              field="maintenance"
            />
          }
        />
      </DataTable>
    );
  }
}
NodesTable.propTypes = {
  intl: PropTypes.object,
  isFetchingNodes: PropTypes.bool.isRequired,
  nodes: ImmutablePropTypes.map.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired
};

export default injectIntl(NodesTable);

export const NodesTableMaintenanceCell = props => {
  const value = result(props.data[props.rowIndex], props.field).toString();
  return <DataTableCell {...props}>{value}</DataTableCell>;
};
NodesTableMaintenanceCell.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  rowIndex: PropTypes.number
};

export const NodesTableMacsCell = props => {
  const value = result(props.data[props.rowIndex], props.field).join(', ');
  return <DataTableCell {...props}>{value}</DataTableCell>;
};
NodesTableMacsCell.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  rowIndex: PropTypes.number
};

export class NodesTableCheckBoxCell extends React.Component {
  render() {
    const nodeId = result(
      this.props.data[this.props.rowIndex],
      this.props.field
    );
    return (
      <DataTableCheckBoxCell
        {...this.props}
        operationInProgress={this.props.nodesInProgress.includes(nodeId)}
      />
    );
  }
}
NodesTableCheckBoxCell.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired,
  rowIndex: PropTypes.number
};

export class NodesTableProfileCell extends React.Component {
  getAssignedRoleTitle() {
    const capabilities = result(
      this.props.data[this.props.rowIndex],
      'properties.capabilities',
      ''
    );
    const profile = parseNodeCapabilities(capabilities).profile;
    return profile ? profile : '-';
  }

  render() {
    return (
      <DataTableCell {...this.props}>
        {this.getAssignedRoleTitle()}
      </DataTableCell>
    );
  }
}
NodesTableProfileCell.propTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number
};
