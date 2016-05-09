import * as _ from 'lodash';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DataTable from '../ui/tables/DataTable';
import { DataTableCell,
         DataTableDataFieldCell,
         DataTableHeaderCell } from '../ui/tables/DataTableCells';
import { DataTableCheckBoxCell } from '../ui/tables/DataTableCells';
import DataTableColumn from '../ui/tables/DataTableColumn';
import Loader from '../ui/Loader';


export default class NodesTable extends React.Component {
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
        <td className="no-results" colSpan="9">
          <Loader loaded={!this.props.isFetchingNodes}
                  height={40}
                  content="Loading Nodes...">
            <p className="text-center">There are no Nodes available</p>
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
    let dataKeys = ['uuid'];
    return filterString ? data.filter((row) => {
      let result = dataKeys.filter((dataKey) => {
        return row[dataKey].toLowerCase().includes(filterString.toLowerCase());
      });
      return result.length > 0;
    }) : data;
  }

  render() {
    let filteredData = this._filterData(this.state.filterString, this.props.nodes.toList().toJS());
    return (
      <DataTable {...this.props}
        data={this.props.nodes.toList().toJS()}
        rowsCount={filteredData.length}
        noRowsRenderer={this.renderNoNodesFound.bind(this)}
        onFilter={this.onFilter.bind(this)}
        filterString={this.state.filterString}>
        <DataTableColumn
          key="select"
          header={<DataTableHeaderCell key="select" className="shrink"/>}
          cell={<NodesTableCheckBoxCell data={filteredData}
                                        nodesInProgress={this.props.nodesInProgress}
                                        field="uuid"
                                        className="shrink"/>}/>
        <DataTableColumn
          key="uuid"
          header={<DataTableHeaderCell key="uuid">UUID</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={filteredData} field="uuid"/>}/>
        <DataTableColumn
          key="role"
          header={<DataTableHeaderCell key="role">Role</DataTableHeaderCell>}
          cell={<NodesTableRoleCell data={filteredData} roles={this.props.roles}/>}/>
        <DataTableColumn
          key="properties.cpu_arch"
          header={<DataTableHeaderCell key="properties.cpu_arch">CPU Arch.</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={filteredData} field="properties.cpu_arch"/>}/>
        <DataTableColumn
          key="properties.cpus"
          header={<DataTableHeaderCell key="properties.cpus">CPU (cores)</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={filteredData} field="properties.cpus"/>}/>
        <DataTableColumn
          key="properties.local_gb"
          header={<DataTableHeaderCell key="properties.local_gb">Disk (GB)</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={filteredData} field="properties.local_gb"/>}/>
        <DataTableColumn
          key="properties.memory_mb"
          header={<DataTableHeaderCell key="properties.memory_mb">Memory (MB)</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={filteredData} field="properties.memory_mb"/>}/>
        <DataTableColumn
          key="power_state"
          header={<DataTableHeaderCell key="power_state">Power State</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={filteredData} field="power_state"/>}/>
        <DataTableColumn
          key="provision_state"
          header={<DataTableHeaderCell key="provision_state">Provision State</DataTableHeaderCell>}
          cell={<DataTableDataFieldCell data={filteredData} field="provision_state"/>}/>
      </DataTable>
    );
  }
}
NodesTable.propTypes = {
  isFetchingNodes: React.PropTypes.bool.isRequired,
  nodes: ImmutablePropTypes.map.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired,
  roles: ImmutablePropTypes.map.isRequired
};

export class NodesTableCheckBoxCell extends React.Component {
  render() {
    const nodeId = _.result(this.props.data[this.props.rowIndex], this.props.field);
    return (
      <DataTableCheckBoxCell
        {...this.props}
        operationInProgress={this.props.nodesInProgress.includes(nodeId)}/>
    );
  }
}
NodesTableCheckBoxCell.propTypes = {
  data: React.PropTypes.array.isRequired,
  field: React.PropTypes.string.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired,
  rowIndex: React.PropTypes.number
};

export class NodesTableRoleCell extends React.Component {
  getAssignedRoleTitle() {
    const fieldValue = _.result(this.props.data[this.props.rowIndex], 'properties.capabilities');
    const capabilitiesMatch = fieldValue.match(/.*profile:(\w+)/);
    if(capabilitiesMatch && Array.isArray(capabilitiesMatch) && capabilitiesMatch.length > 1) {
      const role = this.props.roles.get(capabilitiesMatch[1]);
      return role ? role.title : 'Not assigned';
    } else {
      return 'Not assigned';
    }
  }

  render() {
    return (
      <DataTableCell {...this.props}>
        {this.getAssignedRoleTitle()}
      </DataTableCell>
    );
  }
}
NodesTableRoleCell.propTypes = {
  data: React.PropTypes.array.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  rowIndex: React.PropTypes.number
};
