import { includes } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ClassNames from 'classnames';
import React from 'react';

import Loader from '../ui/Loader';

export default class Validation extends React.Component {
  constructor() {
    super();
    this.state = {
      iconHovered: false
    };
  }

  viewDetails (e) {
    e.preventDefault();
    // TODO: Show the details
  }

  getActionButton() {
    switch (true) {
    case (includes(['new', 'success', 'error', 'failed'], this.props.status)):
      return (
        <button className="btn btn-default btn-xs"
                onClick={() => this.props.runValidation(this.props.id)}>
          Run Now
        </button>
      );
    case (this.props.status === 'running'):
      return (
        <button className="btn btn-danger btn-xs"
                onClick={() => this.props.stopValidation(this.props.id)}>
          Stop
        </button>
      );
    default:
      return null;
    }
  }

  renderValidationStatus(status) {
    const statusIconClass = ClassNames({
      'list-view-pf-icon-md' : true,
      'pficon pficon-error-circle-o': includes(['error', 'failed'], status),
      'pficon pficon-ok':             status === 'success',
      'fa fa-play-circle':           status === 'new'
    });
    return (
      <div onMouseOver={() => this.setState({iconHovered: true})}
           onMouseOut={() => this.setState({iconHovered: false})}>
        <Loader loaded={status != 'running'}
                className="list-view-pf-icon-md"
                size="xl"
                inline>
          <span className={statusIconClass}></span>
        </Loader>
      </div>
    );
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
        <div className="list-view-pf-actions">
          {this.getActionButton()}
        </div>
        <div className="list-view-pf-main-info">
          <div className="list-view-pf-left">
            {this.renderValidationStatus(this.props.status)}
          </div>
          <div className="list-view-pf-body">
            <div className="list-view-pf-description">
              <div className="list-group-item-heading">
                <span title={this.props.name}>{this.props.name}</span>
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
  runValidation: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired,
  stopValidation: React.PropTypes.func.isRequired
};
