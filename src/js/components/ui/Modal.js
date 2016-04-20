import React from 'react';
import ReactDOM from 'react-dom';

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
      <div>
        <div className="modal modal-routed in" role="dialog">
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
  dialogClasses: React.PropTypes.string.isRequired
};

Modal.defaultProps = {
  dialogClasses: ""
};

