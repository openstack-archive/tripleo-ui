import * as _ from 'lodash';
import ClassNames from 'classnames';
import React from 'react';

import Loader from '../ui/Loader';

export default class Validation extends React.Component {
  viewDetails (e) {
    e.preventDefault();
    // TODO: Show the details
  }

  getActionButton() {
    if (_.includes(['new', 'success', 'error', 'failed'], this.props.status)) {
      return (
        <button className="btn btn-default btn-xs pull-right"
                onClick={() => this.props.runValidation(this.props.uuid)}>
          Run Now
        </button>
      );
    } else if (this.props.status === 'running' ) {
      return (
        <button className="btn btn-danger btn-xs pull-right"
                onClick={() => this.props.stopValidation(this.props.uuid)}>
          Stop
        </button>
      );
    } else {
      return false;
    }
  }

  renderValidationStatus(status) {
    const statusIconClass = ClassNames({
      'validation-icon' : true,
      'pficon pficon-error-circle-o': _.includes(['error', 'failed'], status),
      'pficon pficon-ok':             status === 'success',
      'pficon pficon-flag':           status === 'new'
    });
    return (
      <Loader loaded={status != 'running'}
              className="validation-icon"
              size="sm"
              inline>
        <span className={statusIconClass}></span>
      </Loader>
    );
  }

  render() {
    let messageClass = ClassNames({
      'validation-message' : true,
      'no-message' : !this.props.description
    });
    // Make sure there is text when there is no description so vertical spacing remains consistent
    let message = this.props.description || 'Not Available';

    return (
      <div className="col-sm-12 validation">
        <div className="validation-content">
          {this.renderValidationStatus(this.props.status)}
          <div className="validation-info-container">
              <span>{this.props.name}</span>
              <span className={messageClass}>{message}</span>
              <a className="link details-link" onClick={this.viewDetails.bind(this)}>
                View Details
              </a>
          </div>
          <div className="validation-action-button-container">
            {this.getActionButton()}
          </div>
        </div>
      </div>
    );
  }
}

Validation.propTypes = {
  description: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired,
  stopValidation: React.PropTypes.func.isRequired,
  uuid: React.PropTypes.string.isRequired
};
