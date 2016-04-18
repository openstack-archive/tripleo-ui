import * as _ from 'lodash';
import React from 'react';

import TableCheckBox from '../forms/TableCheckBox';

/**
* Default table header cell class
*/
export class DataTableHeaderCell extends React.Component {
  render() {
    return (
      <th {...this.props}>
        {this.props.children}
      </th>
    );
  }
}
DataTableHeaderCell.propTypes = {
  children: React.PropTypes.node
};

/**
* Default table cell class
*/
export class DataTableCell extends React.Component {
  render() {
    return (
      <td {...this.props}>
        {this.props.children}
      </td>
    );
  }
}
DataTableCell.propTypes = {
  children: React.PropTypes.node
};

/**
* Table cell class able to render value from data set passed to columns
*/
export class DataTableDataFieldCell extends React.Component {
  render() {
    let value = _.result(this.props.data[this.props.rowIndex], this.props.field);
    return (
      <DataTableCell {...this.props}>
        {value}
      </DataTableCell>
    );
  }
}
DataTableDataFieldCell.propTypes = {
  data: React.PropTypes.array.isRequired,
  field: React.PropTypes.string.isRequired,
  rowIndex: React.PropTypes.number
};

export class DataTableCheckBoxCell extends React.Component {
  render() {
    let value = _.result(this.props.data[this.props.rowIndex], this.props.field);
    return (
      <DataTableCell {...this.props}>
        <TableCheckBox name={value}
                       id={value}
                       value={false}/>
      </DataTableCell>
    );
  }
}
DataTableCheckBoxCell.propTypes = {
  data: React.PropTypes.array.isRequired,
  field: React.PropTypes.string.isRequired,
  rowIndex: React.PropTypes.number
};
