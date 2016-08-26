import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import FileList from './FileList';

export default class PlanFilesTab extends React.Component {
  render() {
    return (
      <div className={`tab-pane ${this.props.active}`}>
        <FileList planFiles={this.props.planFiles}
                  selectedFiles={this.props.selectedFiles} />
      </div>
    );
  }
}
PlanFilesTab.propTypes = {
  active: React.PropTypes.string,
  planFiles: ImmutablePropTypes.map,
  selectedFiles: React.PropTypes.array
};
