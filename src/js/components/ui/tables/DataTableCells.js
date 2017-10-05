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
import PropTypes from 'prop-types';
import React from 'react';

import TableCheckBox from '../forms/TableCheckBox';
import Loader from '../Loader';

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
  children: PropTypes.node
};

/**
* Default table cell class
*/
export class DataTableCell extends React.Component {
  render() {
    return (
      <td>
        {this.props.children}
      </td>
    );
  }
}
DataTableCell.propTypes = {
  children: PropTypes.node
};

/**
* Table cell class able to render value from data set passed to columns
*/
export class DataTableDataFieldCell extends React.Component {
  render() {
    let value = result(this.props.data[this.props.rowIndex], this.props.field);
    return (
      <DataTableCell {...this.props}>
        {value}
      </DataTableCell>
    );
  }
}
DataTableDataFieldCell.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  rowIndex: PropTypes.number
};

export const DataTableDateFieldCell = props => {
  //TODO(jtomasek): Update this component to parse date and format it using React Intl's
  // FormatedDate
  const value = result(props.data[props.rowIndex], props.field);
  return (
    <DataTableCell {...props}>
      {value}
    </DataTableCell>
  );
};
DataTableDateFieldCell.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  rowIndex: PropTypes.number
};

export class DataTableCheckBoxCell extends React.Component {
  render() {
    let value = result(this.props.data[this.props.rowIndex], this.props.field);
    return (
      <DataTableCell {...this.props}>
        <Loader
          loaded={!this.props.operationInProgress}
          component="span"
          inline
        >
          <TableCheckBox
            name={value}
            id={value}
            value={false}
            disabled={this.props.disabled}
          />
        </Loader>
      </DataTableCell>
    );
  }
}
DataTableCheckBoxCell.propTypes = {
  data: PropTypes.array.isRequired,
  disabled: PropTypes.bool.isRequired,
  field: PropTypes.string.isRequired,
  operationInProgress: PropTypes.bool.isRequired,
  rowIndex: PropTypes.number
};
DataTableCheckBoxCell.defaultProps = {
  disabled: false,
  operationInProgress: true
};
