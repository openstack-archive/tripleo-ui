import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import React from 'react';

import HorizontalStaticText from '../ui/forms/HorizontalStaticText';
import NavTab from '../ui/NavTab';
import PlanFileInput from './PlanFileInput';
import PlanFilesTab from './PlanFilesTab';
import PlanUploadTypeRadios from './PlanUploadTypeRadios';

export default class PlanEditFormTabs extends React.Component {
  setActiveTab(tabName) {
    return this.props.currentTab === tabName ? 'active' : '';
  }

  getFileCount() {
    let planFiles = this.props.planFiles || List();
    let selectedFiles = this.props.selectedFiles || [];
    return selectedFiles.length > planFiles.size
      ? selectedFiles.length
      : planFiles.size;
  }

  render() {

    return (
      <div>
        <ul className="nav nav-tabs">
          <NavTab to={`/plans/${this.props.planName}/edit`}
                  query={{tab: 'editPlan'}}>Update Plan</NavTab>
          <NavTab to={`/plans/${this.props.planName}/edit`}
                  query={{tab: 'planFiles'}}>
            Files <span className="badge">{this.getFileCount.bind(this)()}</span>
          </NavTab>
        </ul>
        <div className="tab-content">
          <PlanFormTab active={this.setActiveTab('editPlan')}
                       planName={this.props.planName}
                       uploadType={this.props.uploadType}
                       setUploadType={this.props.setUploadType}/>
          <PlanFilesTab active={this.setActiveTab('planFiles')}
                        planFiles={this.props.planFiles}
                        selectedFiles={this.props.selectedFiles}/>
        </div>
      </div>
    );
  }
}
PlanEditFormTabs.propTypes = {
  currentTab: React.PropTypes.string,
  planFiles: ImmutablePropTypes.map,
  planName: React.PropTypes.string,
  selectedFiles: React.PropTypes.array,
  setUploadType: React.PropTypes.func.isRequired,
  uploadType: React.PropTypes.string.isRequired
};
PlanEditFormTabs.defaultProps = {
  currentTtab: 'editPlan'
};

class PlanFormTab extends React.Component {

  render() {
    return (
      <div className={`tab-pane ${this.props.active}`}>
        <HorizontalStaticText title="Plan Name"
                              text={this.props.planName}
                              valueColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"/>
        <PlanUploadTypeRadios title="Upload Type"
                              inputColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"
                              setUploadType={this.props.setUploadType}
                              uploadType={this.props.uploadType}/>
        <PlanFileInput name="planFiles"
                       title="Upload Files"
                       inputColumnClasses="col-sm-7"
                       labelColumnClasses="col-sm-3"
                       uploadType={this.props.uploadType}
                       multiple
                       required/>
      </div>
    );
  }
}
PlanFormTab.propTypes = {
  active: React.PropTypes.string,
  planName: React.PropTypes.string,
  setUploadType: React.PropTypes.func.isRequired,
  uploadType: React.PropTypes.string.isRequired
};
