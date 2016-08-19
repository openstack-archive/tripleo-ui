import React from 'react';

import FileList from './FileList';

export default class PlanFilesTab extends React.Component {
  render() {
    return (
      <div className={`tab-pane ${this.props.active}`}>
        <FileList selectedFiles={this.props.selectedFiles} />
      </div>
    );
  }
}
PlanFilesTab.propTypes = {
  active: React.PropTypes.string,
  selectedFiles: React.PropTypes.array
};
