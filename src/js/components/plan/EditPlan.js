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
import { ModalHeader, ModalTitle } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { CloseModalXButton, RoutedModal } from '../ui/Modals';
import { getPlan, getPlanFiles, getIsLoadingPlan } from '../../selectors/plans';
import PlansActions from '../../actions/PlansActions';
import EditPlanForm from './EditPlanForm';
import EditPlanFormTabs from './EditPlanFormTabs';
import { Loader } from '../ui/Loader';
import { planTransitionMessages } from '../../constants/PlansConstants';

const messages = defineMessages({
  cancel: {
    id: 'EditPlan.cancel',
    defaultMessage: 'Cancel'
  },
  editPlan: {
    id: 'EditPlan.editPlan',
    defaultMessage: 'Edit {planName} plan'
  }
});

class EditPlan extends React.Component {
  componentDidMount() {
    this.props.fetchPlanFiles(this.props.match.params.planName);
  }

  handleFormSubmit = (
    { planName, planUploadType, files, tarball },
    dispatch,
    props
  ) => {
    let planFiles = {};
    files.map(({ filePath, contents }) => (planFiles[filePath] = contents));
    return this.props.updatePlan(planName, planFiles);
  };

  render() {
    const {
      plan,
      planFiles,
      intl: { formatMessage },
      isLoadingPlan
    } = this.props;

    return plan ? (
      <RoutedModal
        bsSize="lg"
        id="EditPlan__modal"
        redirectPath="/plans/manage"
      >
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage
              {...messages.editPlan}
              values={{ planName: plan.name }}
            />
          </ModalTitle>
        </ModalHeader>
        <Loader
          loaded={!isLoadingPlan}
          size="lg"
          height={60}
          content={formatMessage(planTransitionMessages.loading, {
            planName: plan.name
          })}
        >
          <EditPlanForm
            onSubmit={this.handleFormSubmit}
            initialValues={{
              planName: plan.name,
              planUploadType: 'directory',
              files: []
            }}
          >
            <EditPlanFormTabs planName={plan.name} planFiles={planFiles} />
          </EditPlanForm>
        </Loader>
      </RoutedModal>
    ) : (
      <Redirect to="/plans" />
    );
  }
}

EditPlan.propTypes = {
  fetchPlanFiles: PropTypes.func,
  intl: PropTypes.object,
  isLoadingPlan: PropTypes.bool.isRequired,
  match: PropTypes.object,
  plan: ImmutablePropTypes.record,
  planFiles: ImmutablePropTypes.set.isRequired,
  updatePlan: PropTypes.func,
  updatePlanFromTarball: PropTypes.func
};

const mapStateToProps = (state, { match: { params: { planName } } }) => ({
  plan: getPlan(state, planName),
  planFiles: getPlanFiles(state, planName),
  isLoadingPlan: getIsLoadingPlan(state, planName)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchPlanFiles: planName => {
    dispatch(PlansActions.fetchPlanFiles(planName));
  },
  updatePlan: (planName, files) => {
    dispatch(PlansActions.updatePlan(planName, files));
  },
  updatePlanFromTarball: (planName, files) => {
    dispatch(PlansActions.updatePlanFromTarball(planName, files));
  }
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(EditPlan)
);
