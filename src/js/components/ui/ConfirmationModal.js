import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../ui/Modal';

export default class ConfirmationModal extends React.Component {
  renderTitle() {
    const iconClass = this.props.iconClass;
    if (iconClass) {
      return (
        <span><span className={iconClass}/> {this.props.title}</span>
      );
    } else {
      return (
        <span>{this.props.title}</span>
      );
    }
  }

  render() {
    return (
      <Modal dialogClasses="modal-sm" show={this.props.show}>
        <div className="modal-header">
          <button type="button"
                  className="close"
                  aria-label="Close"
                  onClick={this.props.onCancel}>
            <span aria-hidden="true" className="pficon pficon-close"/>
          </button>
          <h4 className="modal-title">
            {this.renderTitle()}
          </h4>
        </div>
        <div className="modal-body">
          <p>{this.props.question}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger"
                  type="button"
                  name={this.props.confirmActionName}
                  onClick={this.props.onConfirm}>
            {this.props.confirmActionTitle || this.props.title}
          </button>
          <button type="button"
                  className="btn btn-default"
                  aria-label="Close"
                  onClick={this.props.onCancel}>
            Cancel
          </button>
        </div>
      </Modal>
    );
  }
}
ConfirmationModal.propTypes = {
  confirmActionName: PropTypes.string,
  confirmActionTitle: PropTypes.string,
  iconClass: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};
ConfirmationModal.defaultProps = {
  question: 'Are you sure?'
};
