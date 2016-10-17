import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import { getCurrentStack } from '../../selectors/stacks';
import Modal from '../ui/Modal';
import StacksActions from '../../actions/StacksActions';

class DeploymentDelete extends React.Component {

  onCancelClick() {
    this.props.deleteStack(this.props.currentStack.stack_name, this.props.currentStack.id);
  }

  render() {
    if(this.props.currentStack) {
      return (
        <Modal dialogClasses="modal-sm">
          <div className="modal-header">
            <Link to="/deployment-plan"
                  type="button"
                  className="close">
              <span aria-hidden="true" className="pficon pficon-close"/>
            </Link>
            <h4 className="modal-title">
              <span className="pficon pficon-delete"></span> Delete Stack
            </h4>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete the stack?
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger"
                    onClick={this.onCancelClick.bind(this)}
                    type="submit">
              Delete Stack
            </button>
            <Link to="/deployment-plan" type="button" className="btn btn-default" >Cancel</Link>
          </div>
        </Modal>
      );
    } else {
      return (
        <Modal dialogClasses="modal-sm">
          <div className="modal-header">
            <Link to="/deployment-plan"
                  type="button"
                  className="close">
              <span aria-hidden="true" className="pficon pficon-close"/>
            </Link>
            <h4 className="modal-title">
              <span className="pficon pficon-delete"></span> Delete Stack
            </h4>
          </div>
          <div className="modal-body">
            <p>
              There is no existing deployment.
            </p>
          </div>
          <div className="modal-footer">
            <Link to="/deployment-plan" type="button" className="btn btn-default" >Close</Link>
          </div>
        </Modal>
      );
    }
  }
}

DeploymentDelete.propTypes = {
  currentStack: ImmutablePropTypes.record,
  deleteStack: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    currentStack: getCurrentStack(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteStack: (stackName, stackId) => {
      dispatch(StacksActions.deleteStack(stackName, stackId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentDelete);
