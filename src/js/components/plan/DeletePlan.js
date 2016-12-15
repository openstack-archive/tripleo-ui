import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router';

import PlansActions from '../../actions/PlansActions';
import Modal from '../ui/Modal';

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
      <Modal dialogClasses="modal-sm" id="plans_delete_plan_modal">
        <div className="modal-header">
          <Link to="/plans/list"
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
          <h4 className="modal-title">
            <span className="pficon pficon-delete"></span> Delete {this.getNameFromUrl()}
          </h4>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete plan
            <strong><span id="plans_plan_name"> {this.getNameFromUrl()}</span></strong>?
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger"
                  onClick={this.onDeleteClick.bind(this)}
                  id="plans_delete_plan"
                  type="submit">
            Delete Plan
          </button>
          <Link to="/plans/list"
                type="button"
                className="btn btn-default"
                id="plans_delete_cancel">
            Cancel
          </Link>
        </div>
      </Modal>
    );
  }
}

DeletePlan.propTypes = {
  deletePlan: React.PropTypes.func,
  params: React.PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    deletePlan: planName => {
      dispatch(PlansActions.deletePlan(planName));
    }
  };
}

export default connect(null, mapDispatchToProps)(DeletePlan);
