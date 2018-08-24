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
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { CloseModalButton, CloseModalXButton, RoutedModal } from '../ui/Modals';
import { deletePlan } from '../../actions/PlansActions';

const messages = defineMessages({
  deletePlan: {
    id: 'DeletePlan.deletePlan',
    defaultMessage: 'Delete Plan'
  },
  deletePlanName: {
    id: 'DeletePlan.deletePlanName',
    defaultMessage: 'Delete {planName}'
  },
  deletePlanConfirmation: {
    id: 'DeletePlan.deletePlanConfirmation',
    defaultMessage: 'Are you sure you want to delete plan {planName}?'
  },
  cancel: {
    id: 'DeletePlan.cancel',
    defaultMessage: 'Cancel'
  }
});

class DeletePlan extends React.Component {
  getNameFromUrl() {
    let planName = this.props.match.params.planName || '';
    return planName.replace(/[^A-Za-z0-9_-]*/g, '');
  }

  onDeleteClick() {
    let planName = this.getNameFromUrl();
    if (planName) {
      this.props.deletePlan(planName);
    }
  }

  render() {
    return (
      <RoutedModal
        bsSize="sm"
        id="DeletePlan__deletePlanModal"
        redirectPath="/plans/manage"
      >
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage
              {...messages.deletePlanName}
              values={{ planName: this.getNameFromUrl() }}
            />
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>
            <FormattedMessage
              {...messages.deletePlanConfirmation}
              values={{
                planName: (
                  <strong>
                    <span id="DeletePlan__planName">
                      {this.getNameFromUrl()}
                    </span>
                  </strong>
                )
              }}
            />
          </p>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick.bind(this)}
            id="DeletePlan__deletePlanModalButton"
            type="submit"
          >
            <FormattedMessage {...messages.deletePlan} />
          </button>
          <CloseModalButton id="DeletePlan__cancelDeletePlanModalButton">
            <FormattedMessage {...messages.cancel} />
          </CloseModalButton>
        </ModalFooter>
      </RoutedModal>
    );
  }
}

DeletePlan.propTypes = {
  deletePlan: PropTypes.func,
  match: PropTypes.object,
  params: PropTypes.object
};

function mapDispatchToProps(dispatch, ownProps) {
  return {
    deletePlan: planName => dispatch(deletePlan(planName))
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(DeletePlan));
