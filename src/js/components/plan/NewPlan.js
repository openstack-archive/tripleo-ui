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
import { ModalHeader, ModalTitle, ModalFooter } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { CloseModalButton, CloseModalXButton, RoutedModal } from '../ui/Modals';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import PlansActions from '../../actions/PlansActions';
import PlanFormTabs from './PlanFormTabs';
import { Loader } from '../ui/Loader';

const messages = defineMessages({
  cancel: {
    id: 'NewPlan.cancel',
    defaultMessage: 'Cancel'
  },
  importPlan: {
    id: 'NewPlan.importPlan',
    defaultMessage: 'Import Plan'
  },
  creatingPlanLoader: {
    id: 'NewPlan.creatingPlanLoader',
    defaultMessage: 'Creating plan...'
  },
  uploadAndCreate: {
    id: 'NewPlan.uploadAndCreate',
    defaultMessage: 'Upload Files and Create Plan'
  }
});

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
    this.setState({
      uploadType: e.target.value === 'folder' ? 'folder' : 'tarball'
    });
  }

  onPlanFilesChange(currentValues, isChanged) {
    let files = currentValues.planFiles;
    if (files && files != []) {
      this.setState({ selectedFiles: currentValues.planFiles });
    }
  }

  onFormSubmit(formData, resetForm, invalidateForm) {
    let planFiles = {};
    if (this.state.uploadType === 'folder') {
      this.state.selectedFiles.map(item => {
        planFiles[item.name] = {};
        planFiles[item.name].contents = item.content;
      });
      this.props.createPlan(formData.planName, planFiles);
    } else {
      let file = this.state.selectedFiles[0].file;
      this.props.createPlanFromTarball(formData.planName, file);
    }
  }

  onFormValid() {
    this.setState({ canSubmit: true });
  }

  onFormInvalid() {
    this.setState({ canSubmit: false });
  }

  render() {
    return (
      <RoutedModal
        onHide={() => this.props.cancelCreatePlan()}
        bsSize="lg"
        id="NewPlan__modal"
        redirectPath="/plans/manage"
      >
        <Formsy.Form
          ref="NewPlanForm"
          role="form"
          className="form-horizontal"
          onChange={this.onPlanFilesChange.bind(this)}
          onValidSubmit={this.onFormSubmit.bind(this)}
          onValid={this.onFormValid.bind(this)}
          onInvalid={this.onFormInvalid.bind(this)}
        >
          <ModalHeader>
            <CloseModalXButton />
            <ModalTitle>
              <FormattedMessage {...messages.importPlan} />
            </ModalTitle>
          </ModalHeader>
          <Loader
            loaded={!this.props.isTransitioningPlan}
            size="lg"
            height={100}
            content={this.props.intl.formatMessage(messages.creatingPlanLoader)}
          >
            <ModalFormErrorList errors={this.props.planFormErrors.toJS()} />
            <div className="modal-body">
              <PlanFormTabs
                selectedFiles={this.state.selectedFiles}
                setUploadType={this.setUploadType.bind(this)}
                uploadType={this.state.uploadType}
              />
            </div>
          </Loader>

          <ModalFooter>
            <CloseModalButton id="NewPlan__cancelCreatePlanButton">
              <FormattedMessage {...messages.cancel} />
            </CloseModalButton>
            <button
              disabled={!this.state.canSubmit}
              className="btn btn-primary"
              type="submit"
            >
              <FormattedMessage {...messages.uploadAndCreate} />
            </button>
          </ModalFooter>
        </Formsy.Form>
      </RoutedModal>
    );
  }
}
NewPlan.propTypes = {
  cancelCreatePlan: PropTypes.func,
  createPlan: PropTypes.func,
  createPlanFromTarball: PropTypes.func,
  intl: PropTypes.object,
  isTransitioningPlan: PropTypes.bool,
  location: PropTypes.object,
  planFormErrors: ImmutablePropTypes.list
};

function mapStateToProps(state) {
  return {
    isTransitioningPlan: state.plans.isTransitioningPlan,
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

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(NewPlan)
);
