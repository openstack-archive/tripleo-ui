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

import PropTypes from 'prop-types'
import React from 'react'

export default class DataTableRow extends React.Component {
  render() {
    let cells = this.props.columns.map((column, index) => {
      return React.cloneElement(column.props.cell, {
        rowIndex: this.props.index,
        key: index
      })
    })
    return <tr>{cells}</tr>
  }
}
DataTableRow.propTypes = {
  columns: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired
}
