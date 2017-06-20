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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import ModalFormErrorList from '../ui/forms/FormErrorList';
import PlanEditFormTabs from './PlanEditFormTabs';
import PlansActions from '../../actions/PlansActions';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';

const messages = defineMessages({
  cancel: {
    id: 'EditPlan.cancel',
    defaultMessage: 'Cancel'
  },
  updatePlanNameFiles: {
    id: 'EditPlan.updatePlanNameFiles',
    defaultMessage: 'Update {planName} Files'
  },
  updatingPlanLoader: {
    id: 'EditPlan.updatingPlanLoader',
    defaultMessage: 'Updating plan...'
  },
  uploadAndUpdate: {
    id: 'EditPlan.uploadAndUpdate',
    defaultMessage: 'Upload Files and Update Plan'
  }
});

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
    this.setState({
      uploadType: e.target.value === 'folder' ? 'folder' : 'tarball'
    });
  }

  onPlanFilesChange(currentValues) {
    if (currentValues && currentValues.planFiles) {
      this.setState({ selectedFiles: currentValues.planFiles });
    }
  }

  onFormSubmit(form) {
    let planFiles = {};
    if (this.state.uploadType === 'folder') {
      this.state.selectedFiles.map(item => {
        planFiles[item.name] = {};
        planFiles[item.name].contents = item.content;
      });
      this.props.updatePlan(this.getNameFromUrl(), planFiles);
    } else {
      let file = this.state.selectedFiles[0].file;
      this.props.updatePlanFromTarball(this.getNameFromUrl(), file);
    }
  }

  onFormValid() {
    this.setState({ canSubmit: true });
  }

  onFormInvalid() {
    this.setState({ canSubmit: false });
  }

  getNameFromUrl() {
    let planName = this.props.match.params.planName || '';
    return planName.replace(/[^A-Za-z0-9_-]*/g, '');
  }

  render() {
    let plan = this.props.plans.get(this.getNameFromUrl());
    let planFiles = plan ? plan.files : undefined;

    return (
      <Modal dialogClasses="modal-lg">
        <Formsy.Form
          ref="EditPlanForm"
          role="form"
          className="form-horizontal"
          onChange={this.onPlanFilesChange.bind(this)}
          onValidSubmit={this.onFormSubmit.bind(this)}
          onValid={this.onFormValid.bind(this)}
          onInvalid={this.onFormInvalid.bind(this)}
        >
          <div className="modal-header">
            <Link to="/plans/manage" type="button" className="close">
              <span aria-hidden="true" className="pficon pficon-close" />
            </Link>
            <h4>
              <FormattedMessage
                {...messages.updatePlanNameFiles}
                values={{ planName: this.getNameFromUrl() }}
              />
            </h4>
          </div>
          <Loader
            loaded={!this.props.isTransitioningPlan}
            size="lg"
            height={60}
            content={this.props.intl.formatMessage(messages.updatingPlanLoader)}
          >
            <ModalFormErrorList errors={this.props.planFormErrors.toJS()} />
            <div className="modal-body">
              <PlanEditFormTabs
                selectedFiles={this.state.selectedFiles}
                planName={this.getNameFromUrl()}
                planFiles={planFiles}
                setUploadType={this.setUploadType.bind(this)}
                uploadType={this.state.uploadType}
              />
            </div>
          </Loader>
          <div className="modal-footer">
            <button
              disabled={!this.state.canSubmit}
              className="btn btn-primary"
              type="submit"
            >
              <FormattedMessage {...messages.uploadAndUpdate} />
            </button>
            <Link to="/plans/manage" type="button" className="btn btn-default">
              <FormattedMessage {...messages.cancel} />
            </Link>
          </div>
        </Formsy.Form>
      </Modal>
    );
  }
}

EditPlan.propTypes = {
  fetchPlan: PropTypes.func,
  history: PropTypes.object,
  intl: PropTypes.object,
  isTransitioningPlan: PropTypes.bool,
  match: PropTypes.object,
  params: PropTypes.object,
  planFormErrors: ImmutablePropTypes.list,
  plans: ImmutablePropTypes.map,
  updatePlan: PropTypes.func,
  updatePlanFromTarball: PropTypes.func
};

function mapStateToProps(state) {
  return {
    isTransitioningPlan: state.plans.isTransitioningPlan,
    planFormErrors: state.plans.planFormErrors,
    plans: state.plans.get('all')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchPlan: planName => {
      dispatch(PlansActions.fetchPlan(planName));
    },
    updatePlan: (planName, files) => {
      dispatch(PlansActions.updatePlan(planName, files, ownProps.history));
    },
    updatePlanFromTarball: (planName, files) => {
      dispatch(
        PlansActions.updatePlanFromTarball(planName, files, ownProps.history)
      );
    }
  };
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(EditPlan)
);
