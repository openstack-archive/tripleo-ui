import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import { includes } from 'lodash';

import Modal from '../ui/Modal';
import { ValidationStatusIcon } from './ValidationStatusIcon';

export default class ValidationDetail extends React.Component {
  constructor() {
    super();
    this.state = { isPending: false };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isPending: false });
  }

  /**
   * Decide which validation action to run, if validation is pending (waits for execution to be
   * started) no action can be run
   */
  triggerValidationAction() {
    this.setState({ isPending: true });

    switch (true) {
    case (this.state.isPending):
      break;
    case (this.props.status === 'running'):
      this.props.stopValidation(this.props.results.last().id);
      break;
    default:
      this.props.runValidation();
      break;
    }
  }

  renderValidationGroups() {
    return this.props.groups.map(group => {
      return (
        <small key={group}>
          <span className="label label-default">{group}</span>
          &nbsp;
        </small>
      );
    });
  }

  renderValidationOutput() {
    const lastResult = this.props.results.last();
    if (lastResult && !includes(['running', 'paused'], this.props.status)) {
      return (
        <div>
          <p><strong>Output:</strong></p>
          <pre>{lastResult.output.get('stdout', lastResult.output.get('result'))}</pre>
        </div>
      );
    }
  }

  render() {
    return (
      <Modal dialogClasses="modal-lg">
        <div className="modal-header">
          <button type="button"
                  className="close"
                  aria-label="Close"
                  onClick={this.props.hideValidationDetail}>
            <span aria-hidden="true" className="pficon pficon-close"/>
          </button>
          <h4 className="modal-title">Validation Detail</h4>
        </div>
        <div className="modal-body">
          <div className="validation-detail-title">
            <div className="list-view-pf-left">
              <ValidationStatusIcon
                status={this.state.isPending ? 'running' : this.props.status}
                triggerValidationAction={this.triggerValidationAction.bind(this)}/>
            </div>
            <h3>{this.props.name}</h3>
          </div>
          <p><strong>Description:</strong> <br/>{this.props.description}</p>
          <p><strong>Groups:</strong> {this.renderValidationGroups()}</p>
          <p><strong>Status:</strong> {this.props.status}</p>
          {this.renderValidationOutput()}
        </div>
      </Modal>
    );
  }
}

ValidationDetail.propTypes = {
  description: React.PropTypes.string,
  groups: ImmutablePropTypes.list.isRequired,
  hideValidationDetail: React.PropTypes.func,
  name: React.PropTypes.string.isRequired,
  results: ImmutablePropTypes.map.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired,
  stopValidation: React.PropTypes.func.isRequired
};
