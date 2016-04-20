import React from 'react';
import ReactDOM from 'react-dom';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // add the modal-open class to the body of the page so scrollbars render properly.
  componentWillMount() {
    ReactDOM.findDOMNode(document.documentElement).className = 'modal-open';
  }

  // remove the modal-open class
  componentWillUnmount() {
    ReactDOM.findDOMNode(document.documentElement).className = '';
  }

  render() {
    return (
      <div>
        <div className="modal modal-routed in" role="dialog">
          <div className="modal-dialog modal-lg">
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

Modal.propTypes = { children: React.PropTypes.node };

