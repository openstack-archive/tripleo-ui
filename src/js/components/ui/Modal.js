import React from 'react';
import Portal from 'react-portal';

export default class Modal extends React.Component {
  render() {
    return (
      <Portal isOpened={this.props.show}>
        <PortedModal {...this.props} />
      </Portal>
    );
  }
}
Modal.propTypes = {
  show: React.PropTypes.bool.isRequired
};

Modal.defaultProps = {
  show: true
};

// This component is intended for internal use of Modal Component
// It is used to mount Modal only when it should be shown
class PortedModal extends React.Component {
  // add the modal-open class to the body of the page so scrollbars render properly.
  componentWillMount() {
    document.body.classList.add('modal-open');
  }

  // remove the modal-open class
  componentWillUnmount() {
    document.body.classList.remove('modal-open');
  }

  render() {
    return (
      <div style={{display: 'block'}}>
        <div className="modal modal-visible" role="dialog">
          <div className={`modal-dialog ${this.props.dialogClasses}`} id={this.props.id}>
            <div className="modal-content">
              {this.props.children}
            </div>
          </div>
        </div>
        <div className="modal-backdrop in"></div>
      </div>
    );
  }
}
PortedModal.propTypes = {
  children: React.PropTypes.node,
  dialogClasses: React.PropTypes.string.isRequired,
  id: React.PropTypes.string
};

PortedModal.defaultProps = {
  dialogClasses: ''
};
