import React, { PropTypes } from 'react';

export default class DataTableColumn extends React.Component {
  render() {
    throw new Error('Component <DataTableColumn /> should never render');
  }
}
DataTableColumn.propTypes = {
  cell: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};
