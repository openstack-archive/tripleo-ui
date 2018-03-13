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
import { Redirect } from 'react-router-dom';

import { CloseModalButton, CloseModalXButton, RoutedModal } from '../ui/Modals';
import { getPlan } from '../../selectors/plans';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import PlanEditFormTabs from './PlanEditFormTabs';
import PlansActions from '../../actions/PlansActions';
import { Loader } from '../ui/Loader';

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
    this.props.fetchPlan(this.props.match.params.planName);
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
      this.props.updatePlan(this.props.plan.name, planFiles);
    } else {
      let file = this.state.selectedFiles[0].file;
      this.props.updatePlanFromTarball(this.props.plan.name, file);
    }
  }

  onFormValid() {
    this.setState({ canSubmit: true });
  }

  onFormInvalid() {
    this.setState({ canSubmit: false });
  }

  render() {
    const { plan } = this.props;

    return plan ? (
      <RoutedModal bsSize="lg" redirectPath="/plans/manage">
        <Formsy
          ref="EditPlanForm"
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
              <FormattedMessage
                {...messages.updatePlanNameFiles}
                values={{ planName: plan.name }}
              />
            </ModalTitle>
          </ModalHeader>
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
                planName={plan.name}
                planFiles={plan.files}
                setUploadType={this.setUploadType.bind(this)}
                uploadType={this.state.uploadType}
              />
            </div>
          </Loader>
          <ModalFooter>
            <CloseModalButton>
              <FormattedMessage {...messages.cancel} />
            </CloseModalButton>
            <button
              disabled={!this.state.canSubmit || this.props.isTransitioningPlan}
              className="btn btn-primary"
              type="submit"
            >
              <FormattedMessage {...messages.uploadAndUpdate} />
            </button>
          </ModalFooter>
        </Formsy>
      </RoutedModal>
    ) : (
      <Redirect to="/plans" />
    );
  }
}

EditPlan.propTypes = {
  fetchPlan: PropTypes.func,
  intl: PropTypes.object,
  isTransitioningPlan: PropTypes.bool,
  match: PropTypes.object,
  params: PropTypes.object,
  plan: ImmutablePropTypes.record,
  planFormErrors: ImmutablePropTypes.list,
  updatePlan: PropTypes.func,
  updatePlanFromTarball: PropTypes.func
};

function mapStateToProps(state, ownProps) {
  return {
    isTransitioningPlan: state.plans.isTransitioningPlan,
    planFormErrors: state.plans.planFormErrors,
    plan: getPlan(state, ownProps.match.params.planName)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchPlan: planName => {
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

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(EditPlan)
);
