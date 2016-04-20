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
      <Modal dialogClasses="modal-lg">
        <div className="modal-header">
          <Link to="/plans/list"
                type="button"
                className="close">
            <span className="pficon pficon-close"></span>
          </Link>
          <h4 className="modal-title">
            <span className="pficon pficon-delete"></span> Delete {this.getNameFromUrl()}
          </h4>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete plan <strong>{this.getNameFromUrl()}</strong>?
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger"
                  onClick={this.onDeleteClick.bind(this)}
                  type="submit">
            Delete Plan
          </button>
          <Link to="/plans/list" type="button" className="btn btn-default" >Cancel</Link>
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
