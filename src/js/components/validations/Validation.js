import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { ValidationStatusIcon } from './ValidationStatusIcon';

export default class Validation extends React.Component {
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
        <div key={group} className="list-view-pf-additional-info-item">
          <small>
            <span className="label label-default">{group}</span>
          </small>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="list-group-item list-view-pf-stacked validation">
        <div className="list-view-pf-main-info">
          <div className="list-view-pf-left">
            <ValidationStatusIcon
              status={this.state.isPending ? 'running' : this.props.status}
              triggerValidationAction={this.triggerValidationAction.bind(this)}/>
          </div>
          <div className="list-view-pf-body">
            <div className="list-view-pf-description">
              <div className="list-group-item-heading">
                <a className="link"
                   onClick={() => this.props.showValidationDetail()}
                   title={this.props.name}>{this.props.name}</a>
              </div>
              <div className="list-group-item-text">
                <small title={this.props.description}>{this.props.description}</small>
              </div>
            </div>
            <div className="list-view-pf-additional-info">
              {this.renderValidationGroups()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Validation.propTypes = {
  description: React.PropTypes.string,
  groups: ImmutablePropTypes.list.isRequired,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  results: ImmutablePropTypes.map.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  showValidationDetail: React.PropTypes.func.isRequired,
  status: React.PropTypes.string,
  stopValidation: React.PropTypes.func.isRequired
};
