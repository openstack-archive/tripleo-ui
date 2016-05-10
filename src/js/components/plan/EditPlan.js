import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import FormErrorList from '../ui/forms/FormErrorList';
import PlanEditFormTabs from './PlanEditFormTabs';
import PlansActions from '../../actions/PlansActions';
import Modal from '../ui/Modal';

class EditPlan extends React.Component {

  constructor() {
    super();
    this.state = {
      planName: undefined,
      selectedFiles: undefined,
      canSubmit: false,
      formErrors: [],
      uploadType: 'tarball'
    };
  }

  componentDidMount() {
    this.state.planName = this.getNameFromUrl();
    this.props.fetchPlan(this.state.planName);
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
    this.state.selectedFiles.map(item => {
      planFiles[item.name] = {};
      planFiles[item.name].contents = item.content;
      // TODO(jtomasek): user can identify capabilities-map in the list of files
      // (dropdown select or sth)
      if(item.name.match('^capabilities[-|_]map\.yaml$')) {
        planFiles[item.name].meta = { 'file-type': 'capabilities-map' };
      }
    });
    this.props.updatePlan(this.state.planName, planFiles);
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
    let plan = this.props.plans.filter(plan => plan.name === this.state.planName).first();
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
          <h4>Update {this.state.planName} Files</h4>
        </div>
        <div className="modal-body">
          <FormErrorList errors={this.state.formErrors}/>
          <PlanEditFormTabs currentTab={this.props.location.query.tab || 'editPlan'}
                            planFiles={planFiles}
                            selectedFiles={this.state.selectedFiles}
                            planName={this.state.planName}
                            setUploadType={this.setUploadType.bind(this)}
                            uploadType={this.state.uploadType}/>
        </div>
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
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  plans: ImmutablePropTypes.map,
  updatePlan: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    plans: state.plans.get('all')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlan: planName => {
      dispatch(PlansActions.fetchPlan(planName));
    },
    updatePlan: (planName, files) => {
      dispatch(PlansActions.updatePlan(planName, files));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPlan);
