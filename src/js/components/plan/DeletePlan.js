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
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import PlansActions from '../../actions/PlansActions';
import Modal from '../ui/Modal';

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
      <Modal dialogClasses="modal-sm" id="DeletePlan__deletePlanModal">
        <div className="modal-header">
          <Link to="/plans" type="button" className="close">
            <span aria-hidden="true" className="pficon pficon-close" />
          </Link>
          <h4 className="modal-title">
            <span className="pficon pficon-delete" />
            {' '}
            <FormattedMessage
              {...messages.deletePlanName}
              values={{ planName: this.getNameFromUrl() }}
            />
          </h4>
        </div>
        <div className="modal-body">
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
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick.bind(this)}
            id="DeletePlan__deletePlanModalButton"
            type="submit"
          >
            <FormattedMessage {...messages.deletePlan} />
          </button>
          <Link
            to="/plans"
            type="button"
            className="btn btn-default"
            id="DeletePlan__cancelDeletePlanModalButton"
          >
            <FormattedMessage {...messages.cancel} />
          </Link>
        </div>
      </Modal>
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
    deletePlan: planName => {
      dispatch(PlansActions.deletePlan(planName, ownProps.history));
    }
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(DeletePlan));
