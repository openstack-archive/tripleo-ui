import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import PlansActions from '../../actions/PlansActions';
import PlanFormTabs from './PlanFormTabs';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';

class NewPlan extends React.Component {

  constructor() {
    super();
    this.state = {
      files: [],
      selectedFiles: undefined,
      canSubmit: false,
      uploadType: 'tarball'
    };
  }

  setUploadType(e) {
    this.setState({ uploadType: e.target.value === 'folder' ? 'folder' : 'tarball' });
  }

  onPlanFilesChange(currentValues, isChanged) {
    let files = currentValues.planFiles;
    if (files && files != []) {
      this.setState({ selectedFiles: currentValues.planFiles });
    }
  }

  onFormSubmit(formData, resetForm, invalidateForm) {
    let planFiles = {};
    if(this.state.uploadType === 'folder') {
      this.state.selectedFiles.map(item => {
        planFiles[item.name] = {};
        planFiles[item.name].contents = item.content;
        // TODO(jtomasek): user can identify capabilities-map in the list of files
        // (dropdown select or sth)
        if(item.name.match('^capabilities[-|_]map\.yaml$')) {
          planFiles[item.name].meta = { 'file-type': 'capabilities-map' };
        }
      });
      this.props.createPlan(formData.planName, planFiles);
    }
    else {
      let file = this.state.selectedFiles[0].file;
      this.props.createPlanFromTarball(formData.planName, file);
    }
  }

  onFormValid() {
    this.setState({canSubmit: true});
  }

  onFormInvalid() {
    this.setState({canSubmit: false});
  }

  render () {
    return (
      <Modal dialogClasses="modal-lg">
        <Formsy.Form ref="NewPlanForm"
                     role="form"
                     className="form-horizontal"
                     onChange={this.onPlanFilesChange.bind(this)}
                     onValidSubmit={this.onFormSubmit.bind(this)}
                     onValid={this.onFormValid.bind(this)}
                     onInvalid={this.onFormInvalid.bind(this)}>
          <div className="modal-header">
            <Link to="/plans/list"
                  type="button"
                  onClick={() => this.props.cancelCreatePlan()}
                  className="close">
              <span aria-hidden="true" className="pficon pficon-close"/>
            </Link>
            <h4 className="modal-title">Create New Plan</h4>
          </div>
          <Loader loaded={!this.props.isCreatingPlan}
                  size="lg"
                  content="Creating plan...">
            <ModalFormErrorList errors={this.props.planFormErrors.toJS()}/>
            <div className="modal-body">
                <PlanFormTabs currentTab={this.props.location.query.tab || 'newPlan'}
                              selectedFiles={this.state.selectedFiles}
                              setUploadType={this.setUploadType.bind(this)}
                              uploadType={this.state.uploadType}/>
            </div>
          </Loader>


          <div className="modal-footer">
            <button disabled={!this.state.canSubmit}
                    className="btn btn-primary"
                    type="submit">
              Upload Files and Create Plan
            </button>
            <Link to="/plans/list"
                  type="button"
                  onClick={() => this.props.cancelCreatePlan()}
                  className="btn btn-default">Cancel</Link>
          </div>
        </Formsy.Form>
      </Modal>
    );
  }
}
NewPlan.propTypes = {
  cancelCreatePlan: React.PropTypes.func,
  createPlan: React.PropTypes.func,
  createPlanFromTarball: React.PropTypes.func,
  isCreatingPlan: React.PropTypes.bool,
  location: React.PropTypes.object,
  planFormErrors: ImmutablePropTypes.list
};

function mapStateToProps(state) {
  return {
    isCreatingPlan: state.plans.isCreatingPlan,
    planFormErrors: state.plans.planFormErrors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelCreatePlan: () => {
      dispatch(PlansActions.cancelCreatePlan());
    },
    createPlan: (planName, files) => {
      dispatch(PlansActions.createPlan(planName, files));
    },
    createPlanFromTarball: (planName, archiveContents) => {
      dispatch(PlansActions.createPlanFromTarball(planName, archiveContents));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPlan);
