import React from 'react';

export default class Modal extends React.Component {
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
