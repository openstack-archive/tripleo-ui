import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import ModalFormErrorList from '../ui/forms/FormErrorList';
import PlanEditFormTabs from './PlanEditFormTabs';
import PlansActions from '../../actions/PlansActions';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';

class EditPlan extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedFiles: undefined,
      canSubmit: false,
      uploadType: 'tarball'
    };
  }

  componentDidMount() {
    this.props.fetchPlan(this.getNameFromUrl());
  }

  setUploadType(e) {
    this.setState({ uploadType: e.target.value === 'folder' ? 'folder' : 'tarball' });
  }

  onPlanFilesChange(currentValues) {
    if(currentValues && currentValues.planFiles) {
      this.setState({ selectedFiles: currentValues.planFiles });
    }
  }

  onFormSubmit(form) {
    let planFiles = {};
    if(this.state.uploadType === 'folder') {
      this.state.selectedFiles.map(item => {
        planFiles[item.name] = {};
        planFiles[item.name].contents = item.content;
      });
      this.props.updatePlan(this.getNameFromUrl(), planFiles);
    }
    else {
      let file = this.state.selectedFiles[0].file;
      this.props.updatePlanFromTarball(this.getNameFromUrl(), file);
    }
  }

  onFormValid() {
    this.setState({canSubmit: true});
  }

  onFormInvalid() {
    this.setState({canSubmit: false});
  }

  getNameFromUrl() {
    let planName = this.props.params.planName || '';
    return planName.replace(/[^A-Za-z0-9_-]*/g, '');
  }

  render() {
    let plan = this.props.plans.filter(plan => plan.name === this.getNameFromUrl()).first();
    let planFiles = plan ? plan.files : undefined;

    return (
      <Modal dialogClasses="modal-lg">
        <Formsy.Form ref="EditPlanForm"
                     role="form"
                     className="form-horizontal"
                     onChange={this.onPlanFilesChange.bind(this)}
                     onValidSubmit={this.onFormSubmit.bind(this)}
                     onValid={this.onFormValid.bind(this)}
                     onInvalid={this.onFormInvalid.bind(this)}>
        <div className="modal-header">
          <Link to="/plans/list"
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
          <h4>Update {this.getNameFromUrl()} Files</h4>
        </div>
        <Loader loaded={!this.props.isTransitioningPlan}
                size="lg"
                content="Updating plan...">
          <ModalFormErrorList errors={this.props.planFormErrors.toJS()}/>
          <div className="modal-body">
            <PlanEditFormTabs currentTab={this.props.location.query.tab || 'editPlan'}
                              selectedFiles={this.state.selectedFiles}
                              planName={this.getNameFromUrl()}
                              planFiles={planFiles}
                              setUploadType={this.setUploadType.bind(this)}
                              uploadType={this.state.uploadType}/>
          </div>
        </Loader>
        <div className="modal-footer">
          <button disabled={!this.state.canSubmit}
                  className="btn btn-primary btn-lg"
                  type="submit">
            Upload Files and Update Plan
          </button>
        </div>
        </Formsy.Form>
      </Modal>
    );
  }
}

EditPlan.propTypes = {
  fetchPlan: React.PropTypes.func,
  history: React.PropTypes.object,
  isTransitioningPlan: React.PropTypes.bool,
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  planFormErrors: ImmutablePropTypes.list,
  plans: ImmutablePropTypes.map,
  updatePlan: React.PropTypes.func,
  updatePlanFromTarball: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    isTransitioningPlan: state.plans.isTransitioningPlan,
    planFormErrors: state.plans.planFormErrors,
    plans: state.plans.get('all')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlan: (planName) => {
      dispatch(PlansActions.fetchPlan(planName));
    },
    updatePlan: (planName, files) => {
      dispatch(PlansActions.updatePlan(planName, files));
    },
    updatePlanFromTarball: (planName, files) => {
      dispatch(PlansActions.updatePlanFromTarball(planName, files));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPlan);
