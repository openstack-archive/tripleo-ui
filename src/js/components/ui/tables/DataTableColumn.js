import React from 'react';

export default class DataTableColumn extends React.Component {
  render() {
    throw new Error(
      'Component <DataTableColumn /> should never render'
    );
  }
}
DataTableColumn.propTypes = {
  cell: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func]),
  header: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func])
};
