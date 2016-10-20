import React from 'react';
import Portal from 'react-portal';

export default class Modal extends React.Component {
  render() {
    return (
      <Portal isOpened>
        <div style={{display: this.props.show ? 'block' : 'none'}}>
          <div className="modal modal-visible" role="dialog">
            <div className={`modal-dialog ${this.props.dialogClasses}`}>
              <div className="modal-content">
                {this.props.children}
              </div>
            </div>
          </div>
          <div className="modal-backdrop in"></div>
        </div>
      </Portal>
    );
  }
}

Modal.propTypes = {
  children: React.PropTypes.node,
  dialogClasses: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool.isRequired
};

Modal.defaultProps = {
  dialogClasses: '',
  show: true
};
