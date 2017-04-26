import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

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
    let planName = this.props.params.planName || '';
    return planName.replace(/[^A-Za-z0-9_-]*/g, '');
  }

  onDeleteClick() {
    let planName = this.getNameFromUrl();
    if(planName) {
      this.props.deletePlan(planName);
    }
  }

  render () {
    return (
      <Modal dialogClasses="modal-sm" id="DeletePlan__deletePlanModal">
        <div className="modal-header">
          <Link to="/plans/list"
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
          <h4 className="modal-title">
            <span className="pficon pficon-delete"></span> <FormattedMessage
              {...messages.deletePlanName}
              values={{planName: this.getNameFromUrl()}}
            />
          </h4>
        </div>
        <div className="modal-body">
          <p>
            <FormattedMessage {...messages.deletePlanConfirmation}
                              values={{ planName:
                                <strong>
                                  <span id="DeletePlan__planName">{this.getNameFromUrl()}</span>
                                </strong>}}/>
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger"
                  onClick={this.onDeleteClick.bind(this)}
                  id="DeletePlan__deletePlanModalButton"
                  type="submit">
            <FormattedMessage {...messages.deletePlan}/>
          </button>
          <Link to="/plans/list"
                type="button"
                className="btn btn-default"
                id="DeletePlan__cancelDeletePlanModalButton">
            <FormattedMessage {...messages.cancel}/>
          </Link>
        </div>
      </Modal>
    );
  }
}

DeletePlan.propTypes = {
  deletePlan: PropTypes.func,
  params: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    deletePlan: planName => {
      dispatch(PlansActions.deletePlan(planName));
    }
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(DeletePlan));
